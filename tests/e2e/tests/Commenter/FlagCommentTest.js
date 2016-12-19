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
      .waitForElementVisible('@flagPopUp')
      .waitForElementVisible('@flagCommentOption')
      .click('@flagCommentOption')
      .waitForElementVisible('@flagDoneButton')
      .click('@flagDoneButton')
      .waitForElementVisible('@flagOtherOption')
      .click('@flagOtherOption')
      .waitForElementVisible('@flagDoneButton')
      .click('@flagDoneButton')
      .click('@flagDoneButton')
      .expect.element('@flagButtonText').text.to.equal('Reported');
  },
  after: client => {
    client.end();
  }
};
