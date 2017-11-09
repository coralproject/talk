const iframeId = 'coralStreamEmbed_iframe';
const SortedWindowHandler = require('../utils/SortedWindowHandler');

module.exports = {
  commands: [{
    ready: function() {
      this.switchToIframe();
      this.expect.section('@comments').to.be.present;
      return this.section.comments;
    },
    goToProfileSection: function() {
      this.waitForElementVisible('@profileTabButton');
      this.click('@profileTabButton');
      this.expect.section('@profile').to.be.present;
      return this.section.profile;
    },
    goToCommentsSection: function() {
      this.waitForElementVisible('@commentsTabButton');
      this.click('@commentsTabButton');
      this.expect.section('@comments').to.be.present;
      return this.section.comments;
    },
    navigateToAsset: function(asset) {
      this.api.url(`${this.api.launchUrl}/assets/title/${asset}`);
      return this;
    },
    switchToIframe: function() {
      this.waitForElementVisible('@iframe');

      // Pause a bit to let iframe initialize in the hope that it'll
      // fix https://www.browserstack.com/automate/builds/96419cf46e3d6376a36ae6d3f90934112df1ed91/sessions/224f1a1566c1c8c7859e2e76ece51862200f0173#automate_button
      this.api.pause(1000);

      this.api.frame(iframeId);
      return this;
    },
  }],
  url: function() {
    return this.api.launchUrl;
  },
  elements: {
    iframe: `#${iframeId}`,
    commentsTabButton: '.talk-embed-stream-comments-tab > button',
    profileTabButton: '.talk-embed-stream-profile-tab > button',
    banDialog: '.talk-ban-user-dialog',
    banDialogConfirmButton: '.talk-ban-user-dialog-button-confirm',
  },
  sections: {
    comments: {
      commands: [{
        openLoginPopup(callback) {
          const windowHandler = new SortedWindowHandler(this.api);

          this
            .waitForElementVisible('@signInButton')
            .click('@signInButton');

          // Wait for window to be created
          // https://www.browserstack.com/automate/builds/1ceccf4efb4683b7feb890f45a32b5922b40ed3f/sessions/17b1a79682bef2498cb0be86eac317a08c976b0a#automate_button
          this.api.pause(200);

          // Focusing on the Login PopUp
          windowHandler.windowHandles((handles) => {
            this.api.switchWindow(handles[1]);
          });

          const popup = this.api.page.popup().ready();
          callback(popup);

          // Give a tiny bit of time to let popup close.
          this.api.pause(50);

          if (this.api.capabilities.browserName === 'MicrosoftEdge') {

            // More time for edge.
            // https://www.browserstack.com/automate/builds/1ceccf4efb4683b7feb890f45a32b5922b40ed3f/sessions/7393dbfda8387e43b6d5851f359b0c07db414973
            this.api.pause(1000);
          }

          // Focusing on the Embed Window
          windowHandler.windowHandles((handles) => {
            this.api.switchWindow(handles[0]);
            this.parent.switchToIframe();
          });
        },
        logout() {
          this
            .waitForElementVisible('@logoutButton')
            .click('@logoutButton');
        },
      }],
      selector: '.talk-embed-stream-comments-tab-pane',
      elements: {
        logoutButton: '.talk-stream-userbox-logout',
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
          },
        },
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
  },
};
