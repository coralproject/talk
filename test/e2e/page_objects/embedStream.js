const iframeId = 'coralStreamEmbed_iframe';

module.exports = {
  commands: [{
    navigateToAsset(asset) {
      this.api.url(`${this.api.launchUrl}/assets/title/${asset}`);
      return this;
    },
    getEmbedSection() {
      this.waitForElementVisible('@iframe');
      this.api.frame(iframeId);
      this.expect.section('@embed').to.be.present;
      return this.section.embed;
    },
    login(user = {}) {
      const embedStream = this.page.embedStream();
  
      const embed = embedStream
        .navigate()
        .getEmbedSection();
  
      embed
        .waitForElementVisible('@signInButton')
        .click('@signInButton');
  
      this.pause(3000);
  
      // Focusing on the Login PopUp
      this.windowHandles((result) => {
        const handle = result.value[1];
        this.switchWindow(handle);
      });

      const login = this.page.login();
      
      login
        .setValue('@emailInput', user.email)
        .setValue('@passwordInput', user.password)
        .waitForElementVisible('@signIn')
        .waitForElementVisible('@loginButton')
        .click('@loginButton');

      // Focusing on the Embed Window
      this.windowHandles((result) => {
        const handle = result.value[0];
        this.switchWindow(handle);
      });
    },
    logout() {
      const embedStream = this.page.embedStream();
      
      const embed = embedStream
        .navigate()
        .getEmbedSection();
  
      embed
        .waitForElementVisible('@commentsTabButton')
        .click('@commentsTabButton')
        .waitForElementVisible('@logoutButton')
        .click('@logoutButton');
    }
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
        getProfileSection() {
          this.click('@profileTabButton');
          this.expect.section('@profile').to.be.present;
          return this.section.profile;
        },
        getCommentsSection() {
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
        firstComment: '.talk-stream-comment.talk-stream-comment-level-0',
        firstCommentContent: '.talk-stream-comment.talk-stream-comment-level-0 .talk-stream-comment-content',
        flagButton: '.talk-stream-comment.talk-stream-comment-level-0 .talk-plugin-flags-button',
        respectButton: '.talk-stream-comment.talk-stream-comment-level-0 .talk-stream-comment-footer .talk-plugin-respect-button',
        restrictedMessageBox: '.talk-restricted-message-box',
        suspendedAccountInput: '.talk-suspended-account-username-input',
        suspendedAccountSubmitButton: '.talk-suspended-account-submit-button',
      },
      sections: {
        flag: {
          selector: '.talk-plugin-flags-popup',
          elements: {
            offensiveUsernameRadio: '.talk-plugin-flags-popup-radio#USERNAME_OFFENSIVE',
            flagUsernameRadio: '.talk-plugin-flags-popup-radio#USERS',
            continueButton: '.talk-plugin-flags-popup-button',
            popUpText: '.talk-plugin-flags-popup-text',
          }
        },
        mod: {
          selector: '.talk-plugin-moderation-actions',
          elements: {
            arrow: '.talk-plugin-moderation-actions-arrow',
            menu: '.talk-plugin-modetarion-actions-menu',
            banButton: '.talk-plugin-moderation-actions-ban',
            banDialog: '.talk-ban-user-dialog',
            banDialogbanButton: '.talk-ban-user-dialog-button-ban',
          },
        },
        profile: {
          selector: '.talk-embed-stream-profile-tab-pane',
          elements: {
            notLoggedIn: '.talk-embed-stream-not-logged-in',
            myCommentHistory: '.talk-my-profile-comment-history',
            myCommentHistoryReactions: '.talk-my-profile-comment-history .comment-summary .comment-summary-reactions',
            myCommentHistoryReactionCount: '.talk-my-profile-comment-history .comment-summary .comment-summary-reactions .comment-summary-reaction-count',
            myCommentHistoryComment: '.talk-my-profile-comment-history .my-comment-body',
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
