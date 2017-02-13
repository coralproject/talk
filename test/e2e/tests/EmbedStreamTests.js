const mongoose = require('../../helpers/mongoose');
const mocks = require('../mocks');

const mockComment = 'I read the comments';
const mockReply = 'This is a test reply';
const mockUser = {
  email: `${Date.now()}@test.com`,
  name: `testuser${Math.random()
    .toString()
    .slice(-5)}`,
  pw: 'testtest'
};

module.exports = {
  '@tags': ['embed-stream', 'comment', 'premodoff', 'premodon'],
  before: () => {
    mongoose.waitTillConnect(function(err) {
      if (err) {
        console.error(err);
      }
    });
  },
  'User registers and posts a comment with premod off': client => {
    client.perform((client, done) => {
      mocks.settings({moderation: 'POST'})
      .then(() => {

        // Load Page
        client.resizeWindow(1200, 800)
          .url(client.globals.baseUrl)
          .frame('coralStreamEmbed_iframe')

          // Register and Log In
          .waitForElementVisible('#coralSignInButton', 2000)
          .click('#coralSignInButton')
          .waitForElementVisible('#coralRegister', 1000)
          .click('#coralRegister')
          .waitForElementVisible('#email', 1000)
          .setValue('#email', mockUser.email)
          .setValue('#username', mockUser.name)
          .setValue('#password', mockUser.pw)
          .setValue('#confirmPassword', mockUser.pw)
          .click('#coralSignUpButton')
          .pause(5000)
          .waitForElementVisible('#coralLogInButton', 10000)
          .click('#coralLogInButton')
          .waitForElementVisible('.coral-plugin-commentbox-button', 4000)

          // Post a comment
          .setValue('.coral-plugin-commentbox-textarea', mockComment)
          .click('.coral-plugin-commentbox-button')
          .waitForElementVisible('.coral-plugin-content-text', 1000)

          // Verify that it appears
          .assert.containsText('.coral-plugin-content-text', mockComment);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  },
  'User posts a comment with premod on': client => {
    client.perform((client, done) => {
      mocks.settings({moderation: 'PRE'})
      .then(() => {

        // Load Page
        client.url(client.globals.baseUrl)
          .frame('coralStreamEmbed_iframe');

          // Post a comment
        client.waitForElementVisible('.coral-plugin-commentbox-button', 2000)
          .setValue('.coral-plugin-commentbox-textarea', mockComment)
          .click('.coral-plugin-commentbox-button')
          .waitForElementVisible('#coral-notif', 1000)

          // Verify that it appears
          .assert.containsText('#coral-notif', 'moderation team');
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  },
  'User replies to a comment with premod off': client => {
    client.perform((client, done) => {
      mocks.settings({moderation: 'POST'})
      .then(() => {

        // Load Page
        client.resizeWindow(1200, 800)
          .url(client.globals.baseUrl)
          .frame('coralStreamEmbed_iframe');

          // Post a comment
        client.waitForElementVisible('.coral-plugin-commentbox-button', 2000)
          .setValue('.coral-plugin-commentbox-textarea', mockComment)
          .click('.coral-plugin-commentbox-button')

          // Post a reply
          .waitForElementVisible('.coral-plugin-replies-reply-button', 5000)
          .click('.coral-plugin-replies-reply-button')
          .waitForElementVisible('#replyText')
          .setValue('#replyText', mockReply)
          .click('.coral-plugin-replies-textarea .coral-plugin-commentbox-button')
          .waitForElementVisible('.reply', 20000)

          // Verify that it appears
          .assert.containsText('.reply', mockReply);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  },
  'User replies to a comment with premod on': client => {
    client.perform((client, done) => {
      mocks.settings({moderation: 'PRE'})

      // Add a mock user
      .then(() => mocks.users([{
        username: 'BabyBlue',
        email: 'whale@tale.sea',
        password: 'krillaretasty'
      }]))

      // Add a mock preapproved comment by that user
      .then((user) => mocks.comments([{
        body: 'Whales are not fish.',
        status: 'ACCEPTED',
        author_id: user.id
      }]))
      .then(() => {

        // Load Page
        client.resizeWindow(1200, 800)
          .url(client.globals.baseUrl)
          .frame('coralStreamEmbed_iframe');

          // Post a reply
        client.waitForElementVisible('.coral-plugin-replies-reply-button', 5000)
          .click('.coral-plugin-replies-reply-button')
          .waitForElementVisible('#replyText')
          .setValue('#replyText', mockReply)
          .click('.coral-plugin-replies-textarea button')
          .waitForElementVisible('#coral-notif', 1000)

          // Verify that it appears
          .assert.containsText('#coral-notif', 'moderation team');
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  },
  'Total comment count premod on': client => {
    client.perform((client, done) => {
      client.url(client.globals.baseUrl)
        .frame('coralStreamEmbed_iframe');

        // Verify that comment count is correct
      client.waitForElementVisible('.coral-plugin-comment-count-text', 2000)
        .assert.containsText('.coral-plugin-comment-count-text', '4 Comments');
      done();
    });
  },
  after: client => {
    mongoose.disconnect(function(err) {
      if (err) {
        console.error(err);
      }
    });
    client.end();
  }
};
