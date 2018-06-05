const printBrowserLog = require('../helpers/printBrowserLog');
const commentBody = 'Embed Stream Test';

module.exports = {
  '@tags': ['embedStream', 'login'],

  before: client => {
    client.setWindowPosition(0, 0);
    client.resizeWindow(1600, 1200);
  },

  afterEach: async (client, done) => {
    await printBrowserLog(client);
    if (client.currentTest.results.failed) {
      throw new Error('Test Case failed, skipping all the rest');
    }
    done();
  },

  after: client => {
    client.end();
  },

  'creates a new asset': client => {
    const asset = 'newAssetTest';
    const embedStream = client.page.embedStream();

    embedStream
      .navigateToAsset(asset)
      .assert.title(asset)
      .ready();
  },

  'creates an user and user logs in': client => {
    const {
      testData: { user },
    } = client.globals;
    const embedStream = client.page.embedStream();

    // Go back to default asset.
    const comments = embedStream.navigate().ready();

    comments.openLoginPopup(popup => {
      popup.register(user);
    });
  },
  'user posts a comment': client => {
    const comments = client.page.embedStream().section.comments;

    comments
      .waitForElementVisible('@commentBoxTextarea')
      .setValue('@commentBoxTextarea', commentBody)
      .waitForElementVisible('@commentBoxPostButton')
      .click('@commentBoxPostButton')
      .waitForElementVisible('@firstCommentContent')
      .getText('@firstCommentContent', result => {
        comments.assert.equal(result.value, commentBody);
      });
  },

  'signed in user sees comment history': client => {
    const profile = client.page.embedStream().goToProfileSection();

    profile
      .waitForElementVisible('@myCommentHistory')
      .waitForElementVisible('@myCommentHistoryComment')
      .getText('@myCommentHistoryComment', result => {
        profile.assert.equal(result.value, commentBody);
      });
  },
  'user sees replies and reactions to comments': client => {
    const profile = client.page.embedStream().section.profile;

    profile
      .waitForElementVisible('@myCommentHistory')
      .waitForElementVisible('@myCommentHistoryReactions')
      .waitForElementVisible('@myCommentHistoryReactionCount')
      .getText('@myCommentHistoryReactionCount', result => {
        profile.assert.equal(result.value, '0');
      });
  },
  'user goes to the stream and replies and reacts to comment': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.goToCommentsSection();
    comments.waitForElementVisible('@respectButton').click('@respectButton');

    const profile = embedStream.goToProfileSection();

    profile
      .waitForElementVisible('@myCommentHistory')
      .waitForElementVisible('@myCommentHistoryReactions')
      .waitForElementVisible('@myCommentHistoryReactionCount')
      .getText('@myCommentHistoryReactionCount', result => {
        profile.assert.equal(result.value, '1');
      });
  },
  'user logs out': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.goToCommentsSection();

    comments.logout();
  },
  'admin logs in': client => {
    const {
      testData: { admin },
    } = client.globals;
    const embedStream = client.page.embedStream();

    embedStream
      .navigate()
      .ready()
      .openLoginPopup(popup => popup.login(admin));
  },
  "admin closes stream, users won't be able to perform some actions: reply ": client => {
    const embedStream = client.page.embedStream();

    embedStream
      .goToCommentsSection()
      .waitForElementVisible('@firstComment')
      .waitForElementVisible('@replyButton');

    embedStream.goToConfigSection().closeStream();

    // Pause to give time for action to succeed.
    client.pause(1000);

    embedStream
      .goToCommentsSection()
      .waitForElementVisible('@firstComment')
      .waitForElementNotPresent('@replyButton');

    embedStream.goToConfigSection().openStream();
  },
  'admin logs out': client => {
    const embedStream = client.page.embedStream();
    const comments = embedStream.goToCommentsSection();

    comments.logout();
  },
};
