const mocks = require('../mocks');
const afterEach = require('../after');

module.exports = {
  '@tags': ['embedStream'],
  before: client => {
    client.perform((client, done) => {
      mocks.settings({moderation: 'PRE'})
        .then(() => {
          const embedStreamPage = client.page.embedStreamPage();
          embedStreamPage
            .navigate()
            .ready();
          done();
        });
    });
  },
  'Login as commenter': client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;
    embedStreamPage
      .login(users.commenter);
  },
  'Add test comment': client => {
    const embedStreamPage = client.page.embedStreamPage();
    embedStreamPage
      .postComment('Test Comment');
  },
  'Logout': client => {
    const embedStreamPage = client.page.embedStreamPage();
    embedStreamPage
      .logout();
  },
  'Login as admin': client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;
    embedStreamPage
      .login(users.admin);
  },
  'Approve test comment': client => {
    const adminPage = client.page.adminPage();

    adminPage
      .navigate()
      .ready();

    adminPage
      .approveComment();
  },
  afterEach,
  after: client => {
    client.end();
  }
};
