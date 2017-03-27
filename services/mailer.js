const debug = require('debug')('talk:services:mailer');
const nodemailer = require('nodemailer');
const kue = require('./kue');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const smtpRequiredProps = [
  'TALK_SMTP_FROM_ADDRESS',
  'TALK_SMTP_USERNAME',
  'TALK_SMTP_PASSWORD',
  'TALK_SMTP_HOST'
];

if (smtpRequiredProps.some(prop => !process.env[prop])) {
  console.error(`${smtpRequiredProps.join(', ')} should be defined in the environment if you would like to send password reset emails from Talk`);
}

// load all the templates as strings
const templates = {};

// load the temlates per request during development
if (process.env.NODE_ENV !== 'production') {
  templates.render = (name, format = 'txt', context) => new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'email', [name, format, 'ejs'].join('.')), (err, file) => {
      if (err) {
        return reject(err);
      }

      return resolve(_.template(file)(context));
    });
  });
} else {
  templates.data = fs.readdirSync(path.join(__dirname, 'email')).reduce((data, filename) => {

    // split the filename
    let splitFileName = filename.split('.');

    // remove the ejs extension
    splitFileName.splice(-1, 1);

    const [name, format] = splitFileName;

    if (!(name in data)) {
      data[name] = {};
    }

    data[name][format] = _.template(fs.readFileSync(filename, 'utf8'));

    return data;
  });

  // render a template based on the request name
  templates.render = (name, format = 'txt', context) => templates.data[name][format](context);
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

  sendSimple({template, locals, to, subject}) {
    if (!to) {
      return Promise.reject('sendSimple requires a comma-separated list of "to" addresses');
    }

    if (!subject) {
      return Promise.reject('sendSimple requires a subject for the email');
    }

    // Prefix the subject with `[Talk]`.
    subject = `[Talk] ${subject}`;

    return Promise.all([

      // Render the HTML version of the email.
      templates.render(template, 'html', locals),

      // Render the TEXT version of the email.
      templates.render(template, 'txt', locals)
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
