const afterEach = require('../../after');
const mocks = require('../../mocks');

module.exports = {
  '@tags': ['login', 'ADMIN'],
  before(client) {
    client.perform((client, done) => {
      const embedStreamPage = client.page.embedStreamPage();
      const {users} = client.globals;
      mocks.settings()
      .then(() => mocks.users([users.admin]))
      .then(() => {
        embedStreamPage
        .navigate()
        .ready();
        done();
      })
      .catch((err) => console.log(err));
    });
  },
  'Admin logs in': client => {
    const {users} = client.globals;
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .login(users.admin);
  },
  afterEach,
  after: client => {
    client.end();
  }
};
