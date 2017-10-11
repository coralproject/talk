const uuid = require('uuid');
const {murmur3} = require('murmurhash-js');

module.exports = {
  'Creates a new asset': (client) => {
    const assetTitle = `test@${murmur3(uuid.v4())}`;

    client
      .url(`${client.launchUrl}/assets/title/${assetTitle}`)
      .assert.title(assetTitle)
      .waitForElementVisible('#coralStreamEmbed_iframe', 1000)
      .frame('coralStreamEmbed_iframe')
        .waitForElementVisible('.talk-stream-tab-container', 1000)
        .frameParent()
      .end();
  }
};
