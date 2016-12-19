const embedStreamCommands = {
  url: function () {
    return `${this.api.launchUrl}/admin`;
  },
  ready() {
    return this
      .waitForElementVisible('body', 2000);
  },
  approveComment() {
    return this
      .waitForElementVisible('@commentList')
      .waitForElementVisible('@approveButton')
      .click('@approveButton');
  }
};

export default {
  commands: [embedStreamCommands],
  elements: {
    commentList: {
      selector: '#commentList'
    },
    banButton: {
      selector: '#commentList .actions:first-child .ban'
    },
    rejectButton: {
      selector: '#commentList .actions:first-child .reject'
    },
    approveButton: {
      selector: '#commentList .actions:first-child .approve'
    }
  }
};
