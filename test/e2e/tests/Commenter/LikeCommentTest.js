const afterEach = require('../../after');
const mocks = require('../../mocks');

module.exports = {
  '@tags': ['like', 'comments', 'commenter'],
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
  'Commenter likes a comment': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .likeComment()
      .waitForElementVisible('@likesCount', 2000)
      .expect.element('@likeText').text.to.equal('Liked');

  },
  afterEach,
  after: client => {
    client.end();
  }
};
