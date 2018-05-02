const path = require('path');

module.exports = connectors => {
  const { services: { Mailer } } = connectors;

  // Setup the mail templates.
  ['txt', 'html'].forEach(format => {
    Mailer.templates.register(
      path.join(__dirname, 'emails', `download.${format}.ejs`),
      'download',
      format
    );
  });
};
