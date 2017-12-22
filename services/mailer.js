const debug = require('debug')('talk:services:mailer');
const nodemailer = require('nodemailer');
const kue = require('./kue');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const {attachStaticLocals} = require('../middleware/staticTemplate');

const i18n = require('./i18n');

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
  data: {}
};

// load the templates per request during development
templates.render = (name, format = 'txt', context) => new Promise((resolve, reject) => {

  // If we are in production mode, check the view cache.
  if (process.env.NODE_ENV === 'production') {
    if (name in templates.data && format in templates.data[name]) {
      let view = templates.data[name][format];

      return resolve(view(context));
    }
  }

  const filename = path.join(__dirname, 'email', [name, format, 'ejs'].join('.'));

  fs.readFile(filename, (err, file) => {
    if (err) {
      return reject(err);
    }

    let view = _.template(file);

    // If we are in production mode, fill the view cache.
    if (process.env.NODE_ENV === 'production') {
      if (!(name in templates.data)) {
        templates.data[name] = {};
      }

      templates.data[name][format] = view;
    }

    return resolve(view(context));
  });
});

const mailer = {};

// enabled is true when the required configuration is available. When testing
// is enabled, we will be simulating that emails are being sent, because in a
// production system, emails should and would be sent.
mailer.enabled = Boolean(
  SMTP_HOST && SMTP_HOST.length > 0 &&
  SMTP_USERNAME && SMTP_USERNAME.length > 0 &&
  SMTP_PORT && SMTP_PORT.length > 0 &&
  SMTP_PASSWORD && SMTP_PASSWORD.length > 0 &&
  SMTP_FROM_ADDRESS && SMTP_FROM_ADDRESS.length > 0
) || process.env.NODE_ENV === 'test';

if (mailer.enabled) {
  const options = {
    host: SMTP_HOST,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD
    }
  };

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
  name: 'mailer'
});

/**
 * send will create a new message and send it.
 */
mailer.send = async ({template, locals, to, subject}) => {
  if (!mailer.enabled) {
    throw new Error('email is not enabled because required configuration is not available');
  }

  // Attach the template locals.
  attachStaticLocals(locals);

  // Attach the translation function.
  locals.t = i18n.t;

  // Render the templates.
  const [
    html,
    text,
  ] = await Promise.all(['html', 'txt'].map((fmt) => {
    return templates.render(template, fmt, locals);
  }));

  // Create the job.
  return mailer.task.create({
    title: 'Mail',
    message: {
      to,
      subject: `${EMAIL_SUBJECT_PREFIX} ${subject}`,
      text,
      html
    }
  });
};

/**
 * Start the queue processor for the mailer job.
 */
mailer.process = () => {

  debug(`Now processing ${mailer.task.name} jobs`);

  return mailer.task.process(({id, data}, done) => {
    debug(`Starting to send mail for Job[${id}]`);

    // Set the `from` field.
    data.message.from = SMTP_FROM_ADDRESS;

    // Actually send the email.
    mailer.transport.sendMail(data.message, (err) => {
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
