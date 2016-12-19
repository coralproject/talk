export default {
  '@tags': ['flag', 'commenter'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;

    embedStreamPage
      .navigate()
      .ready();

    embedStreamPage
      .login(users.commenter);
  },
  'Commenter flags a username': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .flagUsername();
  },
  after: client => {
    client.end();
  }
};
