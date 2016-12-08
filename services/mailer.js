const nodemailer = require('nodemailer');

const smtpProps = [
  'TALK_SMTP_USERNAME',
  'TALK_SMTP_PASSWORD',
  'TALK_SMTP_HOST',
  'TALK_SMTP_PORT'
];

smtpProps.forEach(prop => {
  if (!process.env[prop]) {
    console.error(`process.env.${prop} should be defined if you would like to send password reset emails from Talk`);
  }
});

const defaultTransporter = nodemailer.createTransport({
  // https://github.com/nodemailer/nodemailer-wellknown#supported-services
  host: process.env.TALK_SMTP_HOST,
  port: process.env.TALK_SMTP_PORT,
  auth: {
    user: process.env.TALK_SMTP_USERNAME,
    pass: process.env.TALK_SMTP_PASSWORD
  }
});

const mailer = {

  /**
   * sendSimple
   *
   * @param {Object} {from, to, subject, text = '', html = ''}
   * @returns
     */
  sendSimple({from, to, subject, text = '', html = '', transporter = defaultTransporter}) {
    return new Promise((resolve, reject) => {
      if (!from) {
        reject('sendSimple requires a from address');
      }
      if (!to) {
        reject('sendSimple requires a comma-separated list of "to" addresses');
      }
      if (!subject) {
        reject('sendSimple requires a subject for the email');
      }

      return resolve(transporter.sendMail({from, to, subject, text, html}));
    });
  }
};

module.exports = mailer;
