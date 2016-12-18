const fetch = require('node-fetch');

const embedStreamCommands = {
  ready() {
    return this.resizeWindow(1200, 800)
      .url(client.globals.baseUrl)
      .waitForElementVisible('body', 2000)
      .frame('coralStreamIframe');
  },
  login(userData) {
    return this
      .waitForElementVisible('@signInButton')
      .click('@signInButton')
      .waitForElementVisible('@signInDialog');
  },
  setConfig(config, baseUrl) {
    return fetch(`${baseUrl}/api/v1/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(config)
    });
  },
  enterComment() {
    const comment = 'This is a test comment';
    return this
      .waitForElementVisible('@commentBox')
      .setValue('@commentBox', comment)
      .click('@postButton')
      .waitForElementVisible('.comment', 1000);
  },
  validateComment(comment) {
    return this
      .assert.equal(comment, '.comment');
  },
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
