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
      .waitForElementVisible('@likeButton', 2000)
      .click('@likeButton');
  },
  visitorLikeComment() {
    return this
      .waitForElementVisible('@likeButton', 2000)
      .click('@likeButton')
      .waitForElementVisible('@signInDialog', 2000);
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
      selector: '.comment:first-child .coral-plugin-likes-button'
    }
  }
};
