const afterEach = require('../../after');
const mocks = require('../../mocks');

module.exports = {
  '@tags': ['flag', 'comments', 'commenter'],
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
  afterEach,
  after: client => {
    client.end();
  }
};
