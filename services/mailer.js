const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const options = {
  auth: {
    api_key: process.env.TALK_SENDGRID_APIKEY
  }
};

const transporter = nodemailer.createTransport(sgTransport(options));

transporter.sendMail({
  from: 'support@mrdavis.com',
  to: 'riley.davis@gmail.com',
  subject: 'this is only a test',
  text: 'this is the body of the email maybe?',
  html: `<table>
          <thead>
            <tr><th>foo</th><th>bar</th><tr>
          </thead>
          <tbody>
            <tr>
              <td>riley</td><td>davis</td>
            </tr>
          </tbody>
        </table>`
});

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
