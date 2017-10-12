const iframeId = 'coralStreamEmbed_iframe';

module.exports = {
  commands: [{
    navigateToAsset: function(asset) {
      this.api.url(`${this.api.launchUrl}/assets/title/${asset}`);
      return this;
    },
    getEmbedSection: function() {
      this.waitForElementVisible('@iframe');
      this.api.frame(iframeId);
      this.expect.section('@embed').to.be.present;
      return this.section.embed;
    },
  }],
  url: function() {
    return this.api.launchUrl;
  },
  elements: {
    iframe: `#${iframeId}`,
  },
  sections: {
    embed: {
      commands: [{
        getProfileSection: function() {
          this.click('@profileTabButton');
          this.expect.section('@profile').to.be.present;
          return this.section.profile;
        },
      }],
      selector: '#talk-embed-stream-container',
      elements: {
        profileTabButton: '.talk-embed-stream-profile-tab > button',
      },
      sections: {
        profile: {
          selector: '.talk-embed-stream-profile-tab-pane',
          elements: {
            notLoggedIn: '.talk-embed-stream-not-logged-in',
          },
        },
      },
    },
  },
};
