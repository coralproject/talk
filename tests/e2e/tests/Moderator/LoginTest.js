export default {
  '@tags': ['login', 'moderator'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {launchUrl} = client;

    client
    .url(launchUrl);

    embedStreamPage
    .ready();
  },
  'Moderator logs in': client => {
    const {users} = client.globals;
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .login(users.moderator);
  },
  after: client => {
    client.end();
  }
};
