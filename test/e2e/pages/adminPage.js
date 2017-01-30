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
      .waitForElementVisible('@moderationList')
      .waitForElementVisible('@approveButton')
      .click('@approveButton')
      .waitForElementNotPresent('@approveButton');
  }
};

module.exports = {
  commands: [embedStreamCommands],
  elements: {
    moderationList: {
      selector: '#moderationList'
    },
    banButton: {
      selector: '#moderationList .actions:first-child .ban'
    },
    rejectButton: {
      selector: '#moderationList .actions:first-child .reject'
    },
    approveButton: {
      selector: '#moderationList .actions:first-child .approve'
    }
  }
};
