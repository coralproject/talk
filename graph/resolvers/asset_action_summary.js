const AssetActionSummary = {
  __resolveType({ action_type }) {
    switch (action_type) {
      case 'FLAG':
        return 'FlagAssetActionSummary';
      case 'LIKE':
        return 'LikeAssetActionSummary';
      default:
        return undefined;
    }
  },
};

module.exports = AssetActionSummary;
