const mocks = require('../mocks');
const afterEach = require('../after');

module.exports = {
  '@tags': ['embedStream'],
  before: client => {
    client.perform((client, done) => {
      const {users} = client.globals;
      mocks.settings({moderation: 'PRE'})
        .then(() => mocks.users([users.commenter, users.admin]))
        .then((users) => mocks.addRole(users[1].id, 'ADMIN'))
        .then(() => {
          const embedStreamPage = client.page.embedStreamPage();
          embedStreamPage
            .navigate()
            .ready();
          done();
        })
        .catch(console.log);
    });
  },
  'Login as commenter': client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;
    embedStreamPage
      .login(users.commenter)
      .logout();
  },
  'Add test comment': client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;
    embedStreamPage
      .login(users.commenter)
      .postComment('Test Comment')
      .logout();
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

    adminPage
      .navigate()
      .ready();

    adminPage
      .approveComment();
  },
  after: client => {
    client.end();
    afterEach();
  }
};
