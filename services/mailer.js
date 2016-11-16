const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const debug = require('debug')('talk:mail');
const options = {
  auth: {
    api_key: process.env.TALK_SENDGRID_APIKEY
  }
};

if (!process.env.TALK_SENDGRID_APIKEY) {
  debug('\n///////////////////////////////////////////////////////////////\n' +
        '///   TALK_SENDGRID_APIKEY should be defined if you would   ///\n' +
        '///   like to send password reset emails from Talk          ///\n' +
        '///////////////////////////////////////////////////////////////');
}

const transporter = nodemailer.createTransport(sgTransport(options));

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
