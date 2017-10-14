module.exports = {
  commands: [{
    url: function() {
      return `${this.api.launchUrl}/admin`;
    },
    ready() {
      return this
        .waitForElementVisible('body', 2000);
    },
  }],
  elements: {
    'loginLayout': '.talk-admin-login'
  }
};
