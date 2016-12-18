const embedStreamCommands = {
  ready() {
    return this
      .waitForElementVisible('body', 2000)
      .waitForElementVisible('iframe#coralStreamIframe')
      api.frame('coralStreamIframe');
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
      selector: '#commentBox .coral-plugin-commentbox-button'
    }
  }
};
