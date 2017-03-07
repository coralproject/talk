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
      .postComment(`hi ${Math.random()}`)
      .likeComment()
      .waitForElementVisible('@likesCount', 2000)
      .expect.element('@likeText').text.to.equal('Liked');

  },
  after: client => {
    client.end();
  }
};
