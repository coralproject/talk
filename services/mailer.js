const debug = require('debug')('talk:services:mailer');
const nodemailer = require('nodemailer');
const kue = require('./kue');
const i18n = require('./i18n');
const path = require('path');
const fs = require('fs-extra');
const { get, set, merge, template, isObject } = require('lodash');
const { TEMPLATE_LOCALS } = require('../middleware/staticTemplate');
const Context = require('../graph/context');

const {
  SMTP_HOST,
  SMTP_USERNAME,
  SMTP_PORT,
  SMTP_PASSWORD,
  SMTP_FROM_ADDRESS,
  EMAIL_SUBJECT_PREFIX,
} = require('../config');

// load all the templates as strings
const templates = {
  cache: {},
  registered: {},
};

// Registers a template with the given filename and format.
templates.register = async (filename, name, format) => {
  // Check to see if this template was already registered.
  if (get(templates.registered, [name, format], null) !== null) {
    return;
  }

  const file = await fs.readFile(filename, 'utf8');
  const view = template(file);

  set(templates.registered, [name, format], view);
};

// load the templates per request during development
templates.render = async (name, format = 'txt', context) => {
  // Check to see if the template is a registered template (provided by a plugin
  // ) and prefer that first.
  let view = get(templates.registered, [name, format], null);
  if (view !== null) {
    return view(context);
  }

  if (process.env.NODE_ENV === 'production') {
    // If we are in production mode, check the view cache.
    const view = get(templates.cache, [name, format], null);
    if (view !== null) {
      return view(context);
    }
  }

  // Template was not registered and was not cached. Let's try and find it!
  const filename = path.join(
    __dirname,
    'email',
    [name, format, 'ejs'].join('.')
  );
  const file = await fs.readFile(filename, 'utf8');
  view = template(file);

  if (process.env.NODE_ENV === 'production') {
    // If we are in production mode, fill the view cache.
    set(templates.cache, [name, format], view);
  }

  return view(context);
};

const mailer = { templates, helpers: {} };

// enabled is true when the required configuration is available. When testing
// is enabled, we will be simulating that emails are being sent, because in a
// production system, emails should and would be sent.
mailer.enabled =
  Boolean(SMTP_HOST && SMTP_FROM_ADDRESS) || process.env.NODE_ENV === 'test';

if (mailer.enabled) {
  const options = {
    host: SMTP_HOST,
  };

  if (SMTP_USERNAME && SMTP_PASSWORD) {
    options.auth = {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    };
  }

  if (SMTP_PORT) {
    try {
      options.port = parseInt(SMTP_PORT);
    } catch (e) {
      throw new Error('TALK_SMTP_PORT is not an integer');
    }
  } else {
    options.port = 25;
  }

  mailer.transport = nodemailer.createTransport(options);
}

/**
 * Create the new Task kue.
 */
mailer.task = new kue.Task({
  name: 'mailer',
});

/**
 * registerHelpers will register the helpers on the mailer.
 *
 * @param {Object} helpers the helpers in object form that should be used by the
 *                         mailer.
 */
mailer.registerHelpers = helpers => {
  mailer.helpers = merge(mailer.helpers, helpers);
};

/**
 * send will create a new message and send it.
 */
mailer.send = async options => {
  if (!mailer.enabled) {
    const err = new Error(
      'sending email is not enabled because required configuration is not available'
    );
    console.warn(err);
    return;
  }

  // Try to get the user id or the email address from the passed in options. If
  // neither are provided, then error out.
  const email = get(options, 'email');
  const user = isObject(options.user) ? get(options.user, 'id') : options.user;
  if (!user && !email) {
    throw new Error('user not provided');
  }

  // Create the new locals object and attach the static locals and the i18n
  // framework.
  const locals = merge({}, mailer.helpers, options.locals, TEMPLATE_LOCALS, {
    t: i18n.t,
  });

  // Render the templates.
  const [html, text] = await Promise.all(
    ['html', 'txt'].map(fmt => {
      return mailer.templates.render(options.template, fmt, locals);
    })
  );

  // Create the job to send the email later.
  return mailer.task.create({
    title: 'Mail',
    user,
    email,
    message: {
      subject: `${EMAIL_SUBJECT_PREFIX} ${options.subject}`,
      from: SMTP_FROM_ADDRESS,
      text,
      html,
    },
  });
};

/**
 * Start the queue processor for the mailer job.
 */
mailer.process = () => {
  debug(`Now processing ${mailer.task.name} jobs`);

  return mailer.task.process(async ({ id, data }, done) => {
    const { email, user, message } = data;

    debug(`Starting to send mail for Job[${id}]`);

    // If the message has a specific email already to sent it to, just assign
    // that to the message. If the email does not have an email, and instead has
    // a user id, then we should lookup the user with the graph and get their
    // email.
    if (email) {
      message.to = email;
    } else {
      // Get the user to send the message to.
      const ctx = Context.forSystem();

      try {
        const { data, errors } = await ctx.graphql(
          `
            query GetUserEmail($user: ID!) {
              user(id: $user) {
                email
              }
            }
        `,
          { user }
        );
        if (errors) {
          return done(errors);
        }
        const email = get(data, 'user.email');
        if (!email) {
          return done(errors.ErrMissingEmail);
        }

        message.to = email;
      } catch (err) {
        return done(err);
      }
    }

    // Actually send the email.
    mailer.transport.sendMail(message, err => {
      if (err) {
        debug(`Failed to send mail for Job[${id}]:`, err);
        return done(err);
      }

      debug(`Finished sending mail for Job[${id}]`);
      return done();
    });
  });
};

module.exports = mailer;
