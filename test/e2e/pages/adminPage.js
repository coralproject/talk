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
      .waitForElementVisible('@moderateNav')
      .click('@moderateNav')
      .waitForElementVisible('@moderationList')
      .waitForElementVisible('@approveButton')
      .click('@approveButton');
  }
};

module.exports = {
  commands: [embedStreamCommands],
  elements: {
    moderateNav: {
      selector: '#moderateNav'
    },
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
