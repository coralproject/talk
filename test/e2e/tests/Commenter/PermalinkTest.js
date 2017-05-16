let permalink = '';

module.exports = {
  '@tags': ['permalink', 'commenter'],
  before: (client) => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;

    embedStreamPage
      .navigate()
      .ready();

    embedStreamPage
      .login(users.commenter);
  },
  'Commenter gets the permalink of a comment': (client) => {
    const embedStreamPage = client.page.embedStreamPage();
    embedStreamPage
      .getPermalink((value) => {
        permalink = value;
      });
  },
  'Commenter navigates to the permalink': (client) => {
    const embedStreamPage = client.page.embedStreamPage();
    embedStreamPage
      .navigate(permalink);

    client.assert.urlContains(permalink);
  },
  after: (client) => {
    client.end();
  }
};

