const iframeId = 'coralStreamEmbed_iframe';

module.exports = {
  commands: [{
    navigateToAsset: function(asset) {
      this.api.url(`${this.api.launchUrl}/assets/title/${asset}`);
      return this;
    },
    getEmbedSection: function() {
      this.waitForElementVisible('@iframe');

      // Pause a bit to let iframe initialize in the hope that it'll
      // fix https://www.browserstack.com/automate/builds/96419cf46e3d6376a36ae6d3f90934112df1ed91/sessions/224f1a1566c1c8c7859e2e76ece51862200f0173#automate_button
      this.api.pause(200);

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
          this.waitForElementVisible('@profileTabButton');
          this.click('@profileTabButton');
          this.expect.section('@profile').to.be.present;
          return this.section.profile;
        },
        getCommentsSection: function() {
          this.waitForElementVisible('@commentsTabButton');
          this.click('@commentsTabButton');
          this.expect.section('@comments').to.be.present;
          return this.section.comments;
        },
      }],
      selector: '#talk-embed-stream-container',
      elements: {
        logoutButton: '.talk-stream-userbox-logout',
        commentsTabButton: '.talk-embed-stream-comments-tab > button',
        profileTabButton: '.talk-embed-stream-profile-tab > button',
        signInButton: '#coralSignInButton',
        commentBoxTextarea: '#commentText',
        commentBoxPostButton: '.talk-plugin-commentbox-button',
        firstCommentContent: '.talk-stream-comment.talk-stream-comment-level-0 .talk-stream-comment-content',
        respectButton: '.talk-stream-comment.talk-stream-comment-level-0 .talk-stream-comment-footer .talk-plugin-respect-button'
      },
      sections: {
        profile: {
          selector: '.talk-embed-stream-profile-tab-pane',
          elements: {
            notLoggedIn: '.talk-embed-stream-not-logged-in',
            myCommentHistory: '.talk-my-profile-comment-history',
            myCommentHistoryReactions: '.talk-my-profile-comment-history .comment-summary .comment-summary-reactions',
            myCommentHistoryReactionCount: '.talk-my-profile-comment-history .comment-summary .comment-summary-reactions .comment-summary-reaction-count',
            myCommentHistoryComment: '.talk-my-profile-comment-history .my-comment-body'
          },
        },
        comments: {
          selector: '.talk-embed-stream-comments-tab-pane',
          elements: {},
        },
      },
    },
  },
};
