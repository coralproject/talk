const utils = require('../../utils/e2e-mongoose');
const Setting = require('../../../models/setting');
const fetch = require('node-fetch');

const mockComment = 'This is a test comment.';
const mockUser = {
  email: `${new Date().getTime()}@test4.com`,
  name: 'Test User',
  pw: 'testtesttest'
}

module.exports = {
  '@tags': ['embed-stream', 'post'],
  beforeEach: client => {
    return fetch(`${client.globals.baseUrl}/api/v1/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        moderation: 'post'
      })
    });
  },
  'User signs in and posts a comment': client => {
    client.resizeWindow(1200, 800)
    .url(client.globals.baseUrl)
    .frame('coralStreamIframe')
    .waitForElementVisible('#commentBox', 1000)
    .waitForElementVisible('#coralSignInButton', 2000)
    .click('#coralSignInButton button')
    .waitForElementVisible('#coralRegister', 1000)
    .click('#coralRegister')
    .waitForElementVisible('#email', 1000)
    .setValue('#email', mockUser.email)
    .setValue('#displayName', mockUser.name)
    .setValue('#password', mockUser.pw)
    .setValue('#confirmPassword', mockUser.pw)
    .click('#coralSignUpButton')
    .waitForElementVisible('#coralLogInButton', 10000)
    .click('#coralLogInButton')
    .waitForElementVisible('#commentBox', 3000)
    .setValue('#commentBox .coral-plugin-commentbox-textarea', mockComment)
    .click('#commentBox .coral-plugin-commentbox-button')
    .waitForElementVisible('.comment', 1000)
    .assert.containsText('.comment', mockComment);
  },
  after: client => {
    utils.after();
    client.end();
  }
};
