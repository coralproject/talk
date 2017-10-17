module.exports = {
  '@tags': ['embedStream'],

  'Creates a new asset': (client) => {
    const asset = 'newAssetTest';
    const embedStream = client.page.embedStream();

    embedStream
      .navigateToAsset(asset)
      .assert.title(asset)
      .getEmbedSection();
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
