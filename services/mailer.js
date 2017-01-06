const debug = require('debug')('talk:services:mailer');
const nodemailer = require('nodemailer');
const kue = require('./kue');

const smtpRequiredProps = [
  'TALK_SMTP_FROM_ADDRESS',
  'TALK_SMTP_USERNAME',
  'TALK_SMTP_PASSWORD',
  'TALK_SMTP_HOST'
];

if (smtpRequiredProps.some(prop => !process.env[prop])) {
  console.error(`${smtpRequiredProps.join(', ')} should be defined in the environment if you would like to send password reset emails from Talk`);
}

const options = {
  host: process.env.TALK_SMTP_HOST,
  auth: {
    user: process.env.TALK_SMTP_USERNAME,
    pass: process.env.TALK_SMTP_PASSWORD
  }
};

if (process.env.TALK_SMTP_PORT) {
  options.port = process.env.TALK_SMTP_PORT;
} else {
  options.port = 25;
}

const defaultTransporter = nodemailer.createTransport(options);

const mailer = module.exports = {

  /**
   * Create the new Task kue.
   */
  task: new kue.Task({
    name: 'mailer'
  }),

  /**
   * Render renders the template with the given locals and returns the rendered
   * html/text.
   */
  render(app, template, locals = {}) {
    return new Promise((resolve, reject) => {

      // Render the template with the app.render method.
      app.render(template, locals, (err, rendered) => {
        if (err) {
          return reject(err);
        }

        return resolve(rendered);
      });
    });
  },

  sendSimple({app, template, locals, to, subject}) {
    if (!to) {
      return Promise.reject('sendSimple requires a comma-separated list of "to" addresses');
    }

    if (!subject) {
      return Promise.reject('sendSimple requires a subject for the email');
    }

    return Promise.all([

      // Render the HTML version of the email.
      mailer.render(app, template, locals),

      // Render the TEXT version of the email.
      mailer.render(app, `${template}.txt`, locals)
    ])
    .then(([html, text]) => {

      // Create the job.
      return mailer.task.create({
        title: 'Mail',
        message: {
          to,
          subject,
          text,
          html
        }
      });
    });
  },

  /**
   * Start the queue processor for the mailer job.
   */
  process() {

    debug(`Now processing ${mailer.task.name} jobs`);

    return mailer.task.process(({id, data}, done) => {
      debug(`Starting to send mail for Job[${id}]`);

      // Set the `from` field.
      data.message.from = process.env.TALK_SMTP_FROM_ADDRESS;

      // Actually send the email.
      defaultTransporter.sendMail(data.message, (err) => {
        if (err) {
          debug(`Failed to send mail for Job[${id}]:`, err);
          return done(err);
        }

        debug(`Finished sending mail for Job[${id}]`);
        return done();
      });
    });
  }

};
