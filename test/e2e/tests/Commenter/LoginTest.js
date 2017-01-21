module.exports = {
  '@tags': ['login', 'commenter'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .navigate()
      .ready();
  },
  'Commenter logs in': client => {
    const {users} = client.globals;
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .login(users.commenter);
  },
  after: client => {
    client.end();
  }
};
