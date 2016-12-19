export default {
  '@tags': ['flag', 'comments', 'commenter'],
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
      .flagComment()
      .expect.element('@flagButtonText').text.to.equal('Reported');
  },
  after: client => {
    client.end();
  }
};
