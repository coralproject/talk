const afterEach = require('../../after');
const mocks = require('../../mocks');

module.exports = {
  '@tags': ['login', 'MODERATOR'],
  before: client => {

    client.perform((client, done) => {
      const embedStreamPage = client.page.embedStreamPage();
      mocks.settings()
      .then(() => mocks.users([client.globals.users.moderator]))
      .then(() => {
        embedStreamPage
        .navigate()
        .ready();
        done();
      })
      .catch((err) => console.log(err));
    });
  },
  'Moderator logs in': client => {
    const {users} = client.globals;
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .login(users.moderator);
  },
  afterEach,
  after: client => {
    client.end();
  }
};
