export default {
  '@tags': ['login', 'admin'],
  before(client) {
    const embedStreamPage = client.page.embedStreamPage();
    const {launchUrl} = client;

    client
      .url(launchUrl);

    embedStreamPage
      .ready();
  },
  'Admin logs in': client => {
    const {users} = client.globals;
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .login(users.admin);
  },
  after: client => {
    client.end();
  }
};
