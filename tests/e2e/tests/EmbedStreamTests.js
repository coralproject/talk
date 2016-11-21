const utils = require('../../utils/e2e-mongoose');
const Setting = require('../../../models/setting');
const fetch = require('node-fetch');

const comment = 'This is a test comment.';

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
  'User posts a comment': client => {
    client.resizeWindow(1200, 800)
    .url(client.globals.baseUrl)
    .frame('coralStreamIframe')
    .waitForElementVisible('#commentBox', 2000)
    .setValue('#commentBox .coral-plugin-commentbox-textarea', comment)
    .click('#commentBox .coral-plugin-commentbox-button')
    .waitForElementVisible('.comment', 1000)
    .assert.containsText('.comment', comment);
  },
  after: client => {
    utils.after();
    client.end();
  }
};
