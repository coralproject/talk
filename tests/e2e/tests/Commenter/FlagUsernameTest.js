export default {
  tags: 'flag',
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;

    embedStreamPage
      .navigate()
      .ready();

    embedStreamPage
      .login(users.commenter);
  },
  'Commenter flags a comment': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .flagComment();
  },
  after: client => {
    client.end();
  }
};
