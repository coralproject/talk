export default {
  '@tags': ['embedStream'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();
    embedStreamPage
      .navigate()
      .ready();
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
  after: client => {
    client.end();
  }
};
