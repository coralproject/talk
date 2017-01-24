const uuid = require('uuid');

module.exports = {
  '@tags': ['signup', 'visitor'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .navigate()
      .ready();
  },
  'Visitor signs up': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .signUp({
        email: `visitor_${uuid.v4()}@test.com`,
        displayName: 'Visitor',
        pass: 'testtest'
      });
  },
  after: client => {
    client.end();
  }
};
