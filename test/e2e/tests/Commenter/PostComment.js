const afterEach = require('../../after');
const mocks = require('../../mocks');

module.exports = {
  '@tags': ['write', 'commenter'],
  before: client => {
    client.perform((client, done) => {
      const embedStreamPage = client.page.embedStreamPage();
      const {users} = client.globals;
      mocks.settings({moderation: 'PRE'})
      .then(() => mocks.users([users.commenter, users.admin]))
      .then(() => {
        embedStreamPage
        .navigate()
        .ready();

        embedStreamPage
        .login(users.commenter);

        done();
      })
      .catch((err) => console.log(err));
    });
  },
  'Commenter posts a comment': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .postComment('I read the comments');
  },
  afterEach,
  after: client => {
    client.end();
  }
};
