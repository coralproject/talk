const embedStreamCommands = {
  ready() {
    return this
      .waitForElementVisible('body', 2000)
      ;
  },
  login() {
    return this
      .waitForElementVisible('@signInButton')
      .click('@signInButton')
      .waitForElementVisible('@signInDialog');
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
    commentBox: {
      selector: '#commentBox'
    },
    postButton: {
      selector: '#commentBox .coral-plugin-commentbox-button'
    }
  }
};
