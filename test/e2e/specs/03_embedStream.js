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

    embed
      .waitForElementVisible('@signInButton')
      .click('@signInButton');

    // Focusing on the Login PopUp
    client.window_handles((result) => {
      const handle = result.value[1];
      client.switchWindow(handle);
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

    // Focusing on the Embed Window
    client.window_handles((result) => {
      const handle = result.value[0];
      client.switchWindow(handle);
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
