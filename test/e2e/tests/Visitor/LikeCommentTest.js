const afterEach = require('../../after');
const mocks = require('../../mocks');

module.exports = {
  '@tags': ['like', 'comments', 'visitor'],
  before: client => {
    client.perform((client, done) => {
      const embedStreamPage = client.page.embedStreamPage();
      const {users} = client.globals;
      mocks.settings({moderation: 'POST'})
      .then(() => mocks.users([users.commenter]))
      .then(() => {
        embedStreamPage
        .navigate()
        .ready();

        embedStreamPage
        .login(users.commenter)
        .postComment()
        .logout();

        done();
      })
      .catch((err) => console.log(err));
    });
  },
  'Visitor tries to like a comment': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .likeComment()
      .waitForElementVisible('@signInDialog', 2000);
  },
  afterEach,
  after: client => {
    client.end();
  }
};
