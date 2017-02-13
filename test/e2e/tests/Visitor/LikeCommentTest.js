const afterEach = require('../../after');
const mocks = require('../../mocks');
const globals = require('../../globals');

module.exports = {
  '@tags': ['like', 'comments', 'visitor'],
  before: client => {
    client.perform((client, done) => {
      const embedStreamPage = client.page.embedStreamPage();
      mocks.settings({moderation: 'POST'})
      .then(() => mocks.users([globals.users.commenter]))
      .then(() => {
        embedStreamPage
        .navigate()
        .ready();

        embedStreamPage
        .login(globals.users.commenter)
        .postComment()
        .logout();
        
        done();
      })
      .catch((err) => console.log('Err:', err));
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
