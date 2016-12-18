module.exports = {
  '@tags': ['login'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {launchUrl} = client;

    client
      .url(launchUrl)

    embedStreamPage
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
