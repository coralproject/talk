module.exports = {
  '@tags': ['like', 'comments', 'commenter'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;

    embedStreamPage
      .navigate()
      .ready();

    embedStreamPage
      .login(users.commenter);
  },
  'Moderator marks their comment as BEST': client => {
    const embedStreamPage = client.page.embedStreamPage();

    const setBestCommentButton = '.comment:nth-of-type(1) .e2e__set-best-comment';
    const unsetBestCommentButton = '.comment:nth-of-type(1) .e2e__unset-best-comment';
    embedStreamPage
      .postComment('Hi everyone. Isn\'t this the BEST comment!?')
      .waitForElementVisible(setBestCommentButton, 2000, () => {
        client.expect.element(setBestCommentButton).text.to.contain('Tag as Best');        
      })
      .click(setBestCommentButton)
      .waitForElementVisible(unsetBestCommentButton, 2000, () => {
        client.assert.elementNotPresent(setBestCommentButton);
        client.expect.element(unsetBestCommentButton).text.to.contain('Untag as Best');
      });

    // on refresh, it should still be tagged as best :)
    // client
    //   .refresh(() => {

    //   })
    //   .waitForElementVisible(unsetBestCommentButton, 2000)

    // client.pause()
  },
  after: client => {
    client.end();
  }
};
