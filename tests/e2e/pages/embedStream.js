const embedCommands = {
  ready() {
    return this
      .waitForElementVisible('body', 1000);
  },
  enterComment() {
    const comment = 'This is a test comment';
    return this
      .waitForElementVisible('@commentBox')
      .setValue('@commentBox', comment)
      .click('@postButton')
      .waitForElementVisible('.comment', 1000);
  },
  validateComment(comment) {
    return this
      .assert.equal(comment, '.comment');
  }
};

module.exports = {
  commands: [embedCommands],
  elements: {

    commentBox: {
      selector: '#commentBox'
    },
    postButton: {
      selector: '#commentBox .coral-plugin-commentbox-button'
    }
  }
};
