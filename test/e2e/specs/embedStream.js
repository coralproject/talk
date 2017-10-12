const uuid = require('uuid');
const {murmur3} = require('murmurhash-js');

module.exports = {
  'Creates a new asset': (client) => {
    const asset = `test@${murmur3(uuid.v4())}`;
    const embedStream = client.page.embedStream();

    embedStream
      .navigateToAsset(asset)
      .assert.title(asset)
      .getEmbedSection();

    client
      .end();
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

    client
      .end();
  },
};
