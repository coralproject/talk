const iframeId = 'coralStreamEmbed_iframe';
const SortedWindowHandler = require('../helpers/SortedWindowHandler');

module.exports = {
  commands: [
    {
      ready: function() {
        this.switchToIframe();
        this.expect.section('@comments').to.be.visible;
        return this.section.comments;
      },
      goToConfigSection: function() {
        this.waitForElementVisible('@configTabButton');
        this.click('@configTabButton');
        this.expect.section('@config').to.be.visible;
        return this.section.config;
      },
      goToProfileSection: function() {
        this.waitForElementVisible('@profileTabButton');
        this.click('@profileTabButton');
        this.expect.section('@profile').to.be.visible;
        return this.section.profile;
      },
      goToCommentsSection: function() {
        this.waitForElementVisible('@commentsTabButton');
        this.click('@commentsTabButton');
        this.expect.section('@comments').to.be.visible;
        return this.section.comments;
      },
      navigateToAsset: function(asset) {
        this.api.url(`${this.api.launchUrl}/dev/assets/title/${asset}`);
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
    },
  ],
  url: function() {
    return this.api.launchUrl + '/dev/';
  },
  elements: {
    iframe: `#${iframeId}`,
    commentsTabButton: '.talk-embed-stream-comments-tab > button',
    profileTabButton: '.talk-embed-stream-profile-tab > button',
    configTabButton: '.talk-embed-stream-config-tab > button',
    banDialog: '.talk-ban-user-dialog',
    banDialogConfirmButton: '.talk-ban-user-dialog-button-confirm',
  },
  sections: {
    comments: {
      commands: [
        {
          openLoginPopup(callback) {
            const windowHandler = new SortedWindowHandler(this.api);

            this.waitForElementVisible('@signInButton').click('@signInButton');

            // Wait for window to be created
            // https://www.browserstack.com/automate/builds/1ceccf4efb4683b7feb890f45a32b5922b40ed3f/sessions/17b1a79682bef2498cb0be86eac317a08c976b0a#automate_button
            this.api.pause(200);

            // Focusing on the Login PopUp
            windowHandler.windowHandles(handles => {
              this.api.switchWindow(handles[1]);

              const popup = this.api.page.popup().ready();
              callback(popup);

              // Focus on the Embed Window.
              windowHandler.pop();

              // For some reasons firefox does not automatically load auth after login.
              // https://www.browserstack.com/automate/builds/37650cb4e66c6edce0ba0800a1c1b7e7f74bf991/sessions/7a4e9da69b0f9ecdf8b7fa9150639e47b1532cb0#automate_button
              if (this.api.capabilities.browserName === 'firefox') {
                this.parent.navigate().ready();
              } else {
                this.parent.switchToIframe();
              }
            });

            return this;
          },
          logout() {
            this.waitForElementVisible('@logoutButton').click('@logoutButton');
          },
        },
      ],
      selector: '.talk-embed-stream-comments-tab-pane',
      elements: {
        logoutButton: '.talk-stream-userbox-logout',
        signInButton: '#coralSignInButton',
        commentBoxTextarea: '.talk-plugin-commentbox-textarea',
        commentBoxPostButton: '.talk-plugin-commentbox-button',
        firstComment: '.talk-stream-comment.talk-stream-comment-level-0',
        firstCommentContent:
          '.talk-stream-comment.talk-stream-comment-level-0 .talk-stream-comment-content',
        flagButton:
          '.talk-stream-comment.talk-stream-comment-level-0 .talk-plugin-flags-button',
        replyButton:
          '.talk-stream-comment.talk-stream-comment-level-0 .talk-plugin-replies-reply-button',
        respectButton:
          '.talk-stream-comment.talk-stream-comment-level-0 .talk-stream-comment-footer .talk-plugin-respect-button',
        restrictedMessageBox: '.talk-restricted-message-box',
        changeUsernameInput: '.talk-change-username-username-input',
        changeUsernameSubmitButton: '.talk-change-username-submit-button',
      },
      sections: {
        flag: {
          selector: '.talk-plugin-flags-popup',
          elements: {
            offensiveUsernameRadio:
              '.talk-plugin-flags-popup-radio#USERNAME_OFFENSIVE',
            flagUsernameRadio: '.talk-plugin-flags-popup-radio#USERS',
            flagCommentRadio: '.talk-plugin-flags-popup-radio#COMMENTS',
            continueButton: '.talk-plugin-flags-popup-button',
            popUpText: '.talk-plugin-flags-popup-text',
            spamCommentRadio: '.talk-plugin-flags-popup-radio#COMMENT_SPAM',
          },
        },
        mod: {
          selector: '.talk-plugin-moderation-actions',
          elements: {
            arrow: '.talk-plugin-moderation-actions-arrow',
            menu: '.talk-plugin-moderation-actions-menu',
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
        myCommentHistoryReactions:
          '.talk-my-profile-comment-history .comment-summary .comment-summary-reactions',
        myCommentHistoryReactionCount:
          '.talk-my-profile-comment-history .comment-summary .comment-summary-reactions .comment-summary-reaction-count',
        myCommentHistoryComment:
          '.talk-my-profile-comment-history .my-comment-body',
      },
    },
    config: {
      selector: '.talk-embed-stream-config-tab-pane',
      elements: {
        openStream: '.talk-config-close-comments-open-button',
        closeStream: '.talk-config-close-comments-close-button',
      },
      commands: [
        {
          openStream: function() {
            this.waitForElementVisible('@openStream');
            this.click('@openStream');
            this.waitForElementVisible('@closeStream');
            return this.section.config;
          },
          closeStream: function() {
            this.waitForElementVisible('@closeStream');
            this.click('@closeStream');
            this.waitForElementVisible('@openStream');
            return this.section.config;
          },
        },
      ],
    },
  },
};
