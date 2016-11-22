const utils = require('../../utils/e2e-mongoose');

const mockComment = 'This is a test comment.';
const mockReply = 'This is a test reply';
const mockUser = {
  email: `${new Date().getTime()}@test.com`,
  name: 'Test User',
  pw: 'testtesttest'
};

module.exports = {
  '@tags': ['embed-stream', 'comment', 'premodoff', 'premodon'],
  before: () => {
    utils.before();
  },
  'User registers and posts a comment with premod off': client => {
    client.perform((client, done) => {
      client.page.embedStream().setConfig({moderation: 'post'}, client.globals.baseUrl)
      .then(() => {
        //Load Page
        client.resizeWindow(1200, 800)
          .url(client.globals.baseUrl)
          .frame('coralStreamIframe')

          //Register and Log In
          .waitForElementVisible('#commentBox', 1000)
          .waitForElementVisible('#coralSignInButton', 2000)
          .click('#coralSignInButton')
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
          .waitForElementVisible('#commentBox .coral-plugin-commentbox-button', 3000)

          // Post a comment
          .setValue('#commentBox .coral-plugin-commentbox-textarea', mockComment)
          .click('#commentBox .coral-plugin-commentbox-button')
          .waitForElementVisible('.comment', 1000)

          //Verify that it appears
          .assert.containsText('.comment', mockComment);
        done();
      });
    });
  },
  'User posts a comment with premod on': client => {
    client.perform((client, done) => {
      client.page.embedStream().setConfig({moderation: 'pre'}, client.globals.baseUrl)
      .then(() => {
        //Load Page
        client.url(client.globals.baseUrl)
          .frame('coralStreamIframe')
          .pause(10000);

          // Post a comment
        client.waitForElementVisible('#commentBox .coral-plugin-commentbox-button', 2000)
          .setValue('#commentBox .coral-plugin-commentbox-textarea', mockComment)
          .click('#commentBox .coral-plugin-commentbox-button')
          .waitForElementVisible('#coral-notif', 1000)

          //Verify that it appears
          .assert.containsText('#coral-notif', 'moderation team');
        done();
      });
    });
  },
  'User replies to a comment with premod off': client => {
    client.perform((client, done) => {
      client.page.embedStream().setConfig({moderation: 'post'}, client.globals.baseUrl)
      .then(() => {
        //Load Page
        client.resizeWindow(1200, 800)
          .url(client.globals.baseUrl)
          .frame('coralStreamIframe');

          // Post a reply
        client.waitForElementVisible('.coral-plugin-replies-reply-button', 5000)
          .click('.coral-plugin-replies-reply-button')
          .waitForElementVisible('#replyText')
          .setValue('#replyText', mockReply)
          .click('.coral-plugin-replies-textarea button')
          .waitForElementVisible('.reply', 1000)

          //Verify that it appears
          .assert.containsText('.reply', mockReply);
        done();
      });
    });
  },
  'User replies to a comment with premod on': client => {
    client.perform((client, done) => {
      client.page.embedStream().setConfig({moderation: 'pre'}, client.globals.baseUrl)
      .then(() => {
        //Load Page
        client.resizeWindow(1200, 800)
          .url(client.globals.baseUrl)
          .frame('coralStreamIframe')
          .pause(60000);

          // Post a reply
        client.waitForElementVisible('.coral-plugin-replies-reply-button', 5000)
          .click('.coral-plugin-replies-reply-button')
          .waitForElementVisible('#replyText')
          .setValue('#replyText', mockReply)
          .click('.coral-plugin-replies-textarea button')
          .waitForElementVisible('.reply', 1000)

          //Verify that it appears
          .assert.containsText('.reply', mockReply);
        done();
      });
    });
  },
  after: client => {
    utils.after();
    client.end();
  }
};
