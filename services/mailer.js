const nodemailer = require('nodemailer');
const debug = require('debug')('talk:mail');

if (!process.env.TALK_SMTP_CONNECTION_URL) {
  debug('\n///////////////////////////////////////////////////////////////\n' +
        '///   TALK_SMTP_CONNECTION_URL should be defined if you would   ///\n' +
        '///   like to send password reset emails from Talk          ///\n' +
        '///////////////////////////////////////////////////////////////');
}

const transporter = nodemailer.createTransport(process.env.TALK_SMTP_CONNECTION_URL);

const mailer = {
  /**
   * sendSimple
   *
   * @param {Object} {from, to, subject, text = '', html = ''}
   * @returns
     */
  sendSimple ({from, to, subject, text = '', html = ''}) {
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
