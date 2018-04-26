const { ErrCommentingDisabled } = require('../../../errors');

// This phase checks to see if commenting is site-wide disabled.
module.exports = (ctx, comment, { asset }) => {
  // Check to see if the asset has closed commenting...
  if (asset.settings.globalSwitchoffEnable) {
    throw new ErrCommentingDisabled(asset.settings.globalSwitchoffMessage);
  }
};
