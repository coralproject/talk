const nodemailer = require('nodemailer');

const smtpRequiredProps = [
  'TALK_SMTP_FROM_ADDRESS',
  'TALK_SMTP_USERNAME',
  'TALK_SMTP_PASSWORD',
  'TALK_SMTP_HOST'
];

smtpRequiredProps.forEach(prop => {
  if (!process.env[prop]) {
    console.error(`process.env.${prop} should be defined if you would like to send password reset emails from Talk`);
  }
});

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
