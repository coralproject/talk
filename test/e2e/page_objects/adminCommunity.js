module.exports = {
  commands: [{
    url: function() {
      return `${this.api.launchUrl}/admin/community`;
    },
    ready() {
      return this
        .waitForElementVisible('body');
    },
  }],
  elements: {
    container: '.talk-admin-community',
  }
};
