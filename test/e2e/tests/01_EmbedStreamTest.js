const mocks = require('../mocks');
const afterEach = require('../after');

module.exports = {
  '@tags': ['embedStream'],
  beforeEach: client => {
    client.perform((client, done) => {
      const {users} = client.globals;
      mocks.settings({moderation: 'PRE'})
        .then(() => mocks.users([users.commenter, users.admin]))
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
    const {users} = client.globals;
    embedStreamPage
      .login(users.commenter)
      .postComment('Test Comment');
  },
  'Logout': client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;
    embedStreamPage
      .login(users.commenter)
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
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;

    embedStreamPage
      .login(users.commenter)
      .postComment('Test Comment');

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
