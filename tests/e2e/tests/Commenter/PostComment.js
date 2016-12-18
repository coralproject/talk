module.exports = {
  '@tags': ['write', 'commenter'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;

    embedStreamPage
      .navigate()
      .ready();

    embedStreamPage
      .login(users.commenter);
  },
  'Commenter posts a comment': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .postComment('I read the comments');
  },
  after: client => {
    client.end();
  }
};
