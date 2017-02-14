const afterEach = require('../../after');
const mocks = require('../../mocks');

module.exports = {
  '@tags': ['login', 'commenter'],
  beforeEach: client => {
    client.perform((client, done) => {
      const embedStreamPage = client.page.embedStreamPage();
      const {users} = client.globals;
      mocks.settings()
      .then(() => mocks.users([users.commenter]))
      .then(() => {
        embedStreamPage
        .navigate()
        .ready();

        done();
      })
      .catch(console.log);
    });
  },
  'Commenter logs in': client => {
    const {users} = client.globals;
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .login(users.commenter);
  },
  afterEach,
  after: client => {
    client.end();
  }
};
