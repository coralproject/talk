const afterEach = require('../../after');
const mocks = require('../../mocks');

module.exports = {
  '@tags': ['flag', 'commenter'],
  before: client => {
    client.perform((client, done) => {
      const embedStreamPage = client.page.embedStreamPage();
      const {users} = client.globals;
      mocks.settings({moderation: 'POST'})
      .then(() => mocks.users([users.commenter]))
      .then(() => {
        embedStreamPage
        .navigate()
        .ready();

        embedStreamPage
        .login(users.commenter)
        .postComment();

        done();
      })
      .catch((err) => console.log(err));
    });
  },
  'Commenter flags a username': client => {
    const embedStreamPage = client.page.embedStreamPage();

    embedStreamPage
      .flagUsername()
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
  afterEach,
  after: client => {
    client.end();
  }
};
