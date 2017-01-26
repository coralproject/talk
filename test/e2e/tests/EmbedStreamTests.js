const mongoose = require('../../helpers/mongoose');
const mocks = require('../mocks');

const mockComment = 'This is a test comment.';
const mockReply = 'This is a test reply';
const mockUser = {
  email: `${new Date().getTime()}@test.com`,
  name: 'testuser',
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
          .frame('coralStreamIframe')

          // Register and Log In
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
          .waitForElementVisible('.coral-plugin-commentbox-button', 4000)

          // Post a comment
          .setValue('.coral-plugin-commentbox-textarea', mockComment)
          .click('.coral-plugin-commentbox-button')
          .waitForElementVisible('.comment', 1000)

          // Verify that it appears
          .assert.containsText('.comment', mockComment);
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
          .frame('coralStreamIframe');

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
          .frame('coralStreamIframe');

          // Post a comment
        client.waitForElementVisible('.coral-plugin-commentbox-button', 2000)
          .setValue('.coral-plugin-commentbox-textarea', mockComment)
          .click('.coral-plugin-commentbox-button')

          // Post a reply
          .waitForElementVisible('.coral-plugin-replies-reply-button', 5000)
          .click('.coral-plugin-replies-reply-button')
          .waitForElementVisible('#replyText')
          .setValue('#replyText', mockReply)
          .click('.coral-plugin-replies-textarea button')
          .waitForElementVisible('.reply', 2000)

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
      .then(() => {
        return mocks.users([{
          displayName: 'Baby Blue',
          email: 'whale@tale.sea',
          password: 'krill'
        }]);
      })

      // Add a mock preapproved comment by that user
      .then((user) => {
        return mocks.comments([{
          body: 'Whales are not fish.',
          status: 'accepted',
          author_id: user.id
        }]);
      })
      .then(() => {

        // Load Page
        client.resizeWindow(1200, 800)
          .url(client.globals.baseUrl)
          .frame('coralStreamIframe');

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
        .frame('coralStreamIframe');

        // Verify that comment count is correct
      client.waitForElementVisible('.coral-plugin-comment-count-text', 2000)
        .assert.containsText('.coral-plugin-comment-count-text', '2 Comments');
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
