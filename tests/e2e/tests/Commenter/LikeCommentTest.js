module.exports = {
  '@tags': ['like', 'comments', 'commenter'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;

    embedStreamPage
      .navigate()
      .ready();

    embedStreamPage
      .login(users.commenter);
  },
  'Commenter likes a comment': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .likeComment();

  },
  after: client => {
    client.end();
  }
};
