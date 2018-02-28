const kue = require('../kue');
const i18n = require('../i18n');
const { get, merge, isObject } = require('lodash');
const { TEMPLATE_LOCALS } = require('../../middleware/staticTemplate');
const debug = require('debug')('talk:services:mailer');
const { SMTP_FROM_ADDRESS, EMAIL_SUBJECT_PREFIX } = require('../../config');
const templates = require('./templates');

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
      return mailer.templates.render(options.template, fmt, locals);
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

const mailer = { templates, helpers: {} };

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
 * queue will add the message to the sending queue.
 *
 * @param {Object} message the message to be sent
 * @param {Object} recipient the recipient to send it to
 */
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

/**
 * send will prepare the message and queue the message to be sent.
 */
mailer.send = async options => {
  // Create the recipient to sent the message to.
  const recipient = createRecipient(options);

  // Create the message to send.
  const message = await createMessage(options);

  // Create the job to send the message.
  return mailer.queue(message, recipient);
};

module.exports = mailer;
