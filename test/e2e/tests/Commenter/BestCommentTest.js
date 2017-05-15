module.exports = {
  '@tags': ['like', 'comments', 'commenter'],
  before: (client) => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;

    embedStreamPage
      .navigate()
      .ready();

    embedStreamPage
      .login(users.commenter);
  },
  'Commenters should not see the set-best-comment button': (client) => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .postComment('Hi everyone. Isn\'t this the BEST comment!?')
      .waitForElementVisible('@likeButton')
      .expect.element('@setBestButton').to.not.be.present;
  },
  after: (client) => {
    client.end();
  }
};
