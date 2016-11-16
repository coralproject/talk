const comment = 'This is a test comment.';

module.exports = {
  '@tags': ['embed-stream', 'post'],
  'User posts a comment': client => {
    client.resizeWindow(1200, 800)
    .url(client.globals.baseUrl)
    .frame('coralStreamIframe')
    .waitForElementVisible('#commentBox', 1000)
    .setValue('#commentBox .coral-plugin-commentbox-textarea', comment)
    .click('#commentBox .coral-plugin-commentbox-button')
    .waitForElementVisible('.comment', 1000)
    .expect.element('.coral-plugin-comment').to.equal(comment);
  },
  after: client => {
    client.end();
  }
};
