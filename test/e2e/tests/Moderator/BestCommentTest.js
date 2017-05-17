module.exports = {
  '@tags': ['like', 'comments', 'commenter'],
  before: (client) => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals;

    embedStreamPage
      .navigate()
      .ready();

    embedStreamPage
      .login(users.moderator);
  },
  'Moderator marks/unmarks their comment as BEST': (client) => {
    const embedStreamPage = client.page.embedStreamPage();

    const setBestCommentButton = '.e2e__set-best-comment';
    const unsetBestCommentButton = '.e2e__unset-best-comment';

    embedStreamPage
      .postComment(`Hi everyone. Isn't this the BEST comment!? ${String(Math.random()).slice(2)}`)
      .waitForElementVisible(setBestCommentButton, 2000)
      .click(setBestCommentButton)
      .waitForElementVisible(unsetBestCommentButton, 2000);

    // on refresh, it should still be tagged as best :)
    client.refresh();
    embedStreamPage.ready()

      // (bengo) I have no idea why, but if the selector here is '@unsetBestButton', it doesn't find it... I think nightwatch bug?
      // this is why I am not using @elements. Advice appreciated.
      .waitForElementVisible(unsetBestCommentButton, 2000);

    // now remove the best tag
    embedStreamPage
      .click(unsetBestCommentButton);

    embedStreamPage
      .waitForElementVisible(setBestCommentButton, 2000);

    // on refresh it should still be untagged best
    client.refresh();
    embedStreamPage.ready()
      .waitForElementVisible(setBestCommentButton);

  },
  after: (client) => {
    client.end();
  }
};
