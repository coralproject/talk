module.exports = {
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
      .flagUsername()
      .click('@flagButton')
      .waitForElementVisible('@flagPopUp')
      .waitForElementVisible('@flagUsernameOption')
      .click('@flagUsernameOption')
      .waitForElementVisible('@flagDoneButton')
      .click('@flagDoneButton')
      .waitForElementVisible('@flagOtherOption')
      .click('@flagOtherOption')
      .waitForElementVisible('@flagDoneButton')
      .click('@flagDoneButton')
      .click('@flagDoneButton');
  },
  after: client => {
    client.end();
  }
};
