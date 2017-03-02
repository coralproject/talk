const embedStreamCommands = {
  url: function () {
    return this
      .api.launchUrl;
  },
  ready() {
    return this
      .waitForElementVisible('body', 4000)
      .waitForElementVisible('#coralStreamEmbed > iframe')
      .api.frame('coralStreamEmbed_iframe');
  },
  signUp(user) {
    return this
      .waitForElementVisible('@signInButton', 2000)
      .click('@signInButton')
      .waitForElementVisible('@signInDialog')
      .waitForElementVisible('@registerButton')
      .click('@registerButton')
      .setValue('@signInDialogEmail', user.email)
      .setValue('@signInDialogPassword', user.pass)
      .setValue('@signUpDialogConfirmPassword', user.pass)
      .setValue('@signUpDialogUsername', user.username)
      .waitForElementVisible('@signUpButton')
      .click('@signUpButton')
      .waitForElementVisible('@signInViewTrigger')
      .click('@signInViewTrigger')
      .waitForElementVisible('@logInButton')
      .click('@logInButton')
      .waitForElementVisible('@logoutButton', 5000);
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
      .waitForElementVisible('@logoutButton', 5000)
      .click('@logoutButton')
      .waitForElementVisible('@signInButton', 5000);
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
      .click('@likeButton');
  },
  flagComment() {
    return this
      .waitForElementVisible('@flagButton')
      .click('@flagButton');
  },
  flagUsername() {
    return this
      .waitForElementVisible('@flagButton')
      .click('@flagButton');
  },
  getPermalink(fn) {
    return this
      .waitForElementVisible('@permalinkButton')
      .click('@permalinkButton')
      .waitForElementVisible('@permalinkPopUp')
      .getValue('@permalinkInput', result => fn(result.value));
  }
};

module.exports = {
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
    signUpDialogConfirmPassword: {
      selector: '#signInDialog #confirmPassword'
    },
    signUpDialogUsername: {
      selector: '#signInDialog #username'
    },
    logInButton: {
      selector: '#coralLogInButton'
    },
    signUpButton: {
      selector: '#coralSignUpButton'
    },
    signInViewTrigger: {
      selector: '#coralSignInViewTrigger'
    },
    logoutButton: {
      selector: '#coralStream #logout'
    },
    commentBox: {
      selector: '.coral-plugin-commentbox-textarea'
    },
    postButton: {
      selector: '#commentBox .coral-plugin-commentbox-button'
    },
    likeButton: {
      selector: '#stream .coral-plugin-likes-container .coral-plugin-likes-button'
    },
    likeText: {
      selector: '#stream .coral-plugin-likes-container .coral-plugin-likes-button .coral-plugin-likes-button-text'
    },
    likesCount: {
      selector: '#stream .coral-plugin-likes-container .coral-plugin-likes-button .coral-plugin-likes-like-count'
    },
    flagButton: {
      selector: '#stream .coral-plugin-flags-container .coral-plugin-flags-button'
    },
    flagPopUp: {
      selector: '#stream .coral-plugin-flags-popup'
    },
    flagCommentOption: {
      selector: '#stream .coral-plugin-flags-popup .coral-plugin-flags-popup-radio-label[for="COMMENTS"]'
    },
    flagUsernameOption: {
      selector: '#stream .coral-plugin-flags-popup .coral-plugin-flags-popup-radio-label[for="USERS"]'
    },
    flagOtherOption: {
      selector: '#stream .coral-plugin-flags-popup .coral-plugin-flags-popup-radio-label[for="other"]'
    },
    flagHeaderMessage: {
      selector: '#stream .coral-plugin-flags-popup .coral-plugin-flags-popup-header'
    },
    flagButtonText: {
      selector: '#stream .coral-plugin-flags-button-text'
    },
    flagDoneButton: {
      selector: '#stream .coral-plugin-flags-popup .coral-plugin-flags-popup-button'
    },
    permalinkButton: {
      selector: '#stream .coral-plugin-permalinks-button'
    },
    permalinkPopUp: {
      selector: '#stream .coral-plugin-permalinks-popover.active'
    },
    permalinkInput: {
      selector: '#stream .coral-plugin-permalinks-popover.active input'
    },
    registerButton: {
      selector: '#signInDialog #coralRegister'
    }
  }
};
