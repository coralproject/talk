const embedStreamCommands = {
  url: function () {
    return this
      .api.launchUrl;
  },
  ready() {
    return this
      .waitForElementVisible('body', 2000)
      .waitForElementVisible('iframe#coralStreamIframe')
      .api.frame('coralStreamIframe');
  },
  login(user) {
    return this
      .waitForElementVisible('@signInButton', 2000)
      .click('@signInButton')
      .waitForElementVisible('@signInDialog')
      .waitForElementVisible('@signInDialogEmail')
      .waitForElementVisible('@signInDialogPassword')
      .setValue('@signInDialogEmail', user.email)
      .setValue('@signInDialogPassword', user.pass)
      .waitForElementVisible('@logInButton')
      .click('@logInButton')
      .waitForElementVisible('@logoutButton', 5000);
  },
  logout() {
    return this
      .waitForElementVisible('@logoutButton')
      .click('@logoutButton')
      .waitForElementVisible('@signInButton', 2000);
  },
  postComment(comment = 'Test Comment') {
    return this
      .waitForElementVisible('@commentBox', 2000)
      .setValue('@commentBox', comment)
      .click('@postButton');
  },
  likeComment() {
    return this
      .waitForElementVisible('@likeButton')
      .waitForElementVisible('@likesCount')
      .click('@likeButton');
  },
  flagComment() {
    return this
      .waitForElementVisible('@flagButton')
      .click('@flagButton')
      .waitForElementVisible('@flagPopUp')
      .waitForElementVisible('@flagCommentOption')
      .click('@flagCommentOption')
      .waitForElementVisible('@flagDoneButton')
      .click('@flagDoneButton')
      .waitForElementVisible('@flagOtherOption')
      .click('@flagOtherOption')
      .waitForElementVisible('@flagDoneButton')
      .click('@flagDoneButton')
      .click('@flagDoneButton');
  },
  flagUsername() {
    return this
      .waitForElementVisible('@flagButton')
      .click('@flagButton')
      .waitForElementVisible('@flagPopUp')
      .waitForElementVisible('@flagUsernameOption')
      .click('@flagUsernameOption')
      .waitForElementVisible('@flagDoneButton')
      .click('@flagDoneButton')
      .waitForElementVisible('@flagOtherOption')
      .click('@flagOtherOption')
      .waitForElementVisible('@flagDoneButton')
      .click('@flagDoneButton')
      .click('@flagDoneButton');
  }
};

export default {
  commands: [embedStreamCommands],
  elements: {
    signInButton: {
      selector: '#coralSignInButton'
    },
    signInDialog:{
      selector: '#signInDialog'
    },
    signInDialogEmail: {
      selector: '#signInDialog #email'
    },
    signInDialogPassword: {
      selector: '#signInDialog #password'
    },
    logInButton: {
      selector: '#coralLogInButton'
    },
    logoutButton: {
      selector: '.commentStream #logout'
    },
    commentBox: {
      selector: '.coral-plugin-commentbox-textarea'
    },
    postButton: {
      selector: '#commentBox .coral-plugin-commentbox-button'
    },
    likeButton: {
      selector: '.comment .coral-plugin-likes-container .coral-plugin-likes-button'
    },
    likeText: {
      selector: '.comment .coral-plugin-likes-container .coral-plugin-likes-button .coral-plugin-likes-button-text'
    },
    likesCount: {
      selector: '.comment .coral-plugin-likes-container .coral-plugin-likes-button .coral-plugin-likes-like-count'
    },
    flagButton: {
      selector: '.comment .coral-plugin-flags-container .coral-plugin-flags-button'
    },
    flagPopUp: {
      selector: '.comment .coral-plugin-flags-popup'
    },
    flagCommentOption: {
      selector: '.comment .coral-plugin-flags-popup .coral-plugin-flags-popup-radio-label[for="comments"]'
    },
    flagUsernameOption: {
      selector: '.comment .coral-plugin-flags-popup .coral-plugin-flags-popup-radio-label[for="user"]'
    },
    flagOtherOption: {
      selector: '.comment .coral-plugin-flags-popup .coral-plugin-flags-popup-radio-label[for="other"]'
    },
    flagHeaderMessage: {
      selector: '.comment .coral-plugin-flags-popup .coral-plugin-flags-popup-header'
    },
    flagButtonText: {
      selector: '.comment .coral-plugin-flags-button-text'
    },
    flagDoneButton: {
      selector: '.comment .coral-plugin-flags-popup .coral-plugin-flags-popup-button'
    }
  }
};
