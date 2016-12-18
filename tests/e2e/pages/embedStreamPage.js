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
      .click('@logInButton');
  },
  postComment(comment = 'Test Comment') {
    return this
      .waitForElementVisible('@commentBox', 2000)
      .setValue('@commentBox', comment)
      .click('@postButton');
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
    commentBox: {
      selector: '#commentBox'
    },
    postButton: {
      selector: '#commentBox .coral-plugin-commentbox-button button'
    }
  }
};
