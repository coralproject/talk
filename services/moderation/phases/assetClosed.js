const { ErrAssetCommentingClosed } = require('../../../errors');

// This phase checks to see if the asset being processed is closed or not.
module.exports = (ctx, comment, { asset }) => {
  // Check to see if the asset has closed commenting...
  if (asset.isClosed) {
    throw new ErrAssetCommentingClosed(asset.closedMessage);
  }
};
