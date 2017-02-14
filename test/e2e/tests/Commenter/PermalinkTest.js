const afterEach = require('../../after');
const mocks = require('../../mocks');

let permalink = '';

module.exports = {
  '@tags': ['permalink', 'commenter'],
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
        .postComment();

        done();
      })
      .catch((err) => console.log(err));
    });
  },
  'Commenter gets the permalink of a comment': client => {
    const embedStreamPage = client.page.embedStreamPage();
    embedStreamPage
      .getPermalink(value => {
        permalink = value;
      });
  },
  'Commenter navigates to the permalink': client => {
    const embedStreamPage = client.page.embedStreamPage();
    embedStreamPage
      .navigate(permalink);

    client.assert.urlContains(permalink);
  },
  afterEach,
  after: client => {
    client.end();
  }
};
