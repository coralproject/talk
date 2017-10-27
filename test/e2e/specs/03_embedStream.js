class SortedWindowHandler {

  constructor(client) {
    this.client = client;
    this.client.windowHandles((result) => {
      this.handles = result.value;
      if (this.handles.length > 2) {
        throw new Error('SortedWindowHandler must be created before new windows were created.');
      }
    });
  }

  windowHandles(callback) {
    this.client.windowHandles((result) => {
      console.log(result);
      this.handles = this.handles.filter((handle) => result.value.includes(handle));
      const remaining = result.value.filter((handle) => !this.handles.includes(handle));
      if (remaining.length === 1) {
        this.handles.push(remaining[0]);
      }
      if (remaining.length > 1) {
        throw new Error('Cannot detect new window handle, because more than one windows was created.');
      }
      callback(this.handles);
    });
  }
}

module.exports = {
  '@tags': ['embedStream', 'login'],
  'creates a new asset': (client) => {
    const asset = 'newAssetTest';
    const embedStream = client.page.embedStream();

    embedStream
      .navigateToAsset(asset)
      .assert.title(asset)
      .getEmbedSection();
  },

  'creates an user and user logs in': (client) => {
    const {testData: {user}} = client.globals;
    const embedStream = client.page.embedStream();

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    const windowHandler = new SortedWindowHandler(client);

    embed
      .waitForElementVisible('@signInButton')
      .click('@signInButton');

    // Focusing on the Login PopUp
    windowHandler.windowHandles((handles) => {
      client.switchWindow(handles[1]);
    });

    const login = client.page.login();

    login
      .waitForElementVisible('@registerButton')
      .click('@registerButton')
      .setValue('@emailInput', user.email)
      .setValue('@usernameInput', user.username)
      .setValue('@passwordInput', user.password)
      .setValue('@confirmPasswordInput', user.password)
      .waitForElementVisible('@signUpButton')
      .click('@signUpButton')
      .waitForElementVisible('@signIn')
      .waitForElementVisible('@loginButton')
      .click('@loginButton');

    // Give a tiny bit of time to let popup close.
    client.pause(50);

    if (client.capabilities.browserName === 'MicrosoftEdge') {

      // More time for edge.
      // https://www.browserstack.com/automate/builds/1ceccf4efb4683b7feb890f45a32b5922b40ed3f/sessions/7393dbfda8387e43b6d5851f359b0c07db414973
      client.pause(1000);
    }

    // Focusing on the Embed Window
    windowHandler.windowHandles((handles) => {
      client.switchWindow(handles[0]);
    });
  },
  'user posts a comment': (client) => {
    const embedStream = client.page.embedStream();
    const {testData: {comment}} = client.globals;

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    embed
      .waitForElementVisible('@commentBoxTextarea')
      .setValue('@commentBoxTextarea', comment.body)
      .waitForElementVisible('@commentBoxPostButton')
      .click('@commentBoxPostButton')
      .waitForElementVisible('@firstCommentContent')
      .getText('@firstCommentContent', (result) => {
        embed.assert.equal(result.value, comment.body);
      });
  },

  'signed in user sees comment history': (client) => {
    const embedStream = client.page.embedStream();
    const {testData: {comment}} = client.globals;

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    const profile = embed
      .getProfileSection();

    profile
      .waitForElementVisible('@myCommentHistory')
      .waitForElementVisible('@myCommentHistoryComment')
      .getText('@myCommentHistoryComment', (result) => {
        profile.assert.equal(result.value, comment.body);
      });
  },
  'user sees replies and reactions to comments': (client) => {
    const embedStream = client.page.embedStream();

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    const profile = embed
      .getProfileSection();

    profile
      .waitForElementVisible('@myCommentHistory')
      .waitForElementVisible('@myCommentHistoryReactions')
      .waitForElementVisible('@myCommentHistoryReactionCount')
      .getText('@myCommentHistoryReactionCount', (result) => {
        profile.assert.equal(result.value, '0');
      });
  },
  'user goes to the stream and replies and reacts to comment': (client) => {
    const embedStream = client.page.embedStream();

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    embed
      .waitForElementVisible('@respectButton')
      .click('@respectButton');

    const profile = embed
      .getProfileSection();

    profile
      .waitForElementVisible('@myCommentHistory')
      .waitForElementVisible('@myCommentHistoryReactions')
      .waitForElementVisible('@myCommentHistoryReactionCount')
      .getText('@myCommentHistoryReactionCount', (result) => {
        profile.assert.equal(result.value, '1');
      });
  },
  'user logs out': (client) => {
    const embedStream = client.page.embedStream();

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    embed
      .waitForElementVisible('@commentsTabButton')
      .click('@commentsTabButton')
      .waitForElementVisible('@logoutButton')
      .click('@logoutButton');
  },
  'not logged in user clicks my profile tab': (client) => {
    const embedStream = client.page.embedStream();

    const embed = embedStream
      .navigate()
      .getEmbedSection();

    const profile = embed
      .getProfileSection();

    profile
      .assert.visible('@notLoggedIn');
  },
  after: (client) => {
    client.end();
  }
};
