module.exports = {
  '@tags': ['like', 'comments', 'commenter'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;

    embedStreamPage
      .navigate()
      .ready();

    embedStreamPage
      .login(users.moderator);
  },
  'Moderator marks their comment as BEST': client => {
    const embedStreamPage = client.page.embedStreamPage();

    const setBestCommentButton = '@setBestButton';
    const unsetBestCommentButton = '@unsetBestButton';

    embedStreamPage
      .postComment('Hi everyone. Isn\'t this the BEST comment!?')
      .waitForElementVisible(setBestCommentButton, 2000)
      .click(setBestCommentButton)
      .waitForElementVisible(unsetBestCommentButton, 2000, () => {
        client.assert.elementNotPresent(setBestCommentButton);
      });

    // on refresh, it should still be tagged as best :)
    client.refresh();
    client.page.embedStreamPage().ready()
      .waitForElementVisible('.e2e__unset-best-comment', 2000);
  },
  after: client => {
    client.end();
  }
};
