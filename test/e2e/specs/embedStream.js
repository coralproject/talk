const uuid = require('uuid');
const {murmur3} = require('murmurhash-js');

const iframeId = 'coralStreamEmbed_iframe';

const $ = {
  streamEmbedIframe: `#${iframeId}`,
  streamTabContainer: '.talk-stream-tab-container',
};

module.exports = {
  'Creates a new asset': (client) => {
    const assetTitle = `test@${murmur3(uuid.v4())}`;

    client
      .url(`${client.launchUrl}/assets/title/${assetTitle}`)
      .assert.title(assetTitle)
      .waitForElementVisible($.streamEmbedIframe)
      .frame(iframeId)
        .waitForElementVisible($.streamTabContainer)
        .frameParent()
      .end();
  }
};
