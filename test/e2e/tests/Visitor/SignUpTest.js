const afterEach = require('../../after');
const mocks = require('../../mocks');

module.exports = {
  '@tags': ['signup', 'visitor'],
  before: client => {
    client.perform((client, done) => {
      const embedStreamPage = client.page.embedStreamPage();
      mocks.settings()
        .then(() => {
          embedStreamPage
            .navigate()
            .ready();
          done();
        })
        .catch(console.log);
    });
  },
  'Visitor signs up': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .signUp({
        email: `visitor_${Date.now()}@test.com`,
        username: `visitor${Date.now()}`,
        pass: 'testtest'
      });
  },
  afterEach,
  after: client => {
    client.end();
  }
};
