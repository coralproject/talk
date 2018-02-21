const nodemailer = require('nodemailer');
const kue = require('./kue');
const i18n = require('./i18n');
const path = require('path');
const fs = require('fs-extra');
const { get, set, merge, template, isObject } = require('lodash');
const { TEMPLATE_LOCALS } = require('../middleware/staticTemplate');
const debug = require('debug')('talk:services:mailer');

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

// createMessage creates a message payload to send a email to a user.
const createMessage = async options => {
  // Create the new locals object and attach the static locals and the i18n
  // framework.
  const locals = merge({}, mailer.helpers, options.locals, TEMPLATE_LOCALS, {
    t: i18n.t,
  });

  // Render the templates.
  const [html, text] = await Promise.all(
    ['html', 'txt'].map(fmt => {
      return mailer.templates.render(template, fmt, locals);
    })
  );

  const subject = EMAIL_SUBJECT_PREFIX
    ? `${EMAIL_SUBJECT_PREFIX} ${options.subject}`
    : options.subject;

  return {
    html,
    text,
    subject,
    from: SMTP_FROM_ADDRESS,
  };
};

mailer.queue = async (message, recipient) => {
  debug('Creating Job');

  // Create the job to send the email later.
  const job = await mailer.task.create(
    merge(
      {
        title: 'Mail',
        message,
      },
      recipient
    )
  );

  debug(`Created Job[${job.id}]`);

  return job;
};

// createRecipient will extract the recipient details from the options.
const createRecipient = options => {
  // Try to get the email if it was explicitly provided.
  const email = get(options, 'email');
  if (email) {
    return { email };
  }

  // Try to get the user if the email wasn't explicitly provided.
  const user = isObject(options.user) ? get(options.user, 'id') : options.user;
  if (user) {
    return { user };
  }

  // If we don't have a user or a email, we can't send an email.
  throw new Error('user/email not provided');
};

/**
 * send will prepare the message and queue the message to be sent.
 */
mailer.send = async options => {
  if (!mailer.enabled) {
    const err = new Error(
      'sending email is not enabled because required configuration is not available'
    );
    console.warn(err);
    return;
  }

  // Create the recipient to sent the message to.
  const recipient = createRecipient(options);

  // Create the message to send.
  const message = await createMessage(options);

  // Create the job to send the message.
  return mailer.queue(message, recipient);
};

module.exports = mailer;
