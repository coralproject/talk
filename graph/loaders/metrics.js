const _ = require('lodash');
const CommentModel = require('../../models/comment');
const AssetModel = require('../../models/asset');
const ActionModel = require('../../models/action');

const getMetrics = (context, {from, to}) => {

  let commentMetrics = {};
  let assetMetrics = [];

  return ActionModel.aggregate([

    // Find all actions that were created in the time range.
    {$match: {
      action_type: 'FLAG',
      item_type: 'COMMENTS',
      created_at: {
        $gt: from,
        $lt: to
      }
    }},

    // Count all those items.
    {$group: {
      _id: '$item_id',
      count: {
        $sum: 1
      }
    }},

    // Project the count to a better field.
    {$project: {
      item_id: '$_id',
      count: '$count'
    }}
  ]).then((actionSummaries) => {

    // Collect all the action summaries into a dictionary.
    actionSummaries.forEach((actionSummary) => {
      commentMetrics[actionSummary.item_id] = actionSummary.count;
    });

    // Collect just the comment id's.
    let commentIDs = actionSummaries.map((as) => as.item_id);

    // Find those comments.
    return CommentModel.aggregate([

      // Get only those comments.
      {$match: {
        id: {
          $in: commentIDs
        }
      }},

      // Group by their asset id and push in the comment id.
      {$group: {
        _id: {
          asset_id: '$asset_id'
        },
        ids: {
          $addToSet: '$id'
        }
      }},

      // Project that data only as better fields.
      {$project: {
        asset_id: '$_id.asset_id',
        ids: '$ids'
      }}
    ]);
  })
  .then((commentResults) => {

    // Compute all the action summaries for the assets based on the time slice
    // that you requested.
    commentResults.forEach((result) => {
      let actionCount = 0;

      result.ids.forEach((id) => {
        actionCount += commentMetrics[id];
      });

      assetMetrics.push({
        id: result.asset_id,
        actionCount,
        actionableItemCount: result.ids.length
      });
    });

    // Sort the assets by flag count.
    assetMetrics.sort((a, b) => {
      return b.flags - a.flags;
    });

    // Only keep the top 10.
    assetMetrics = assetMetrics.slice(0, 10);

    // Determine the assets that we need to return.
    return AssetModel.find({
      id: {
        $in: assetMetrics.map((asset) => asset.id)
      }
    });
  })
  .then((assets) => {

    // Join up the assets that are returned by their id.
    let groupedAssets = _.groupBy(assets, 'id');

    // Return from the sorted asset metrics and return their assetes.
    return assetMetrics.map(({id, actionCount, actionableItemCount}) => {
      if (id in groupedAssets) {
        let asset = groupedAssets[id][0];

        let flagAssetActionSummary = {
          action_type: 'FLAG',
          actionCount,
          actionableItemCount
        };

        // Add the action summaries to the asset.
        asset.action_summaries = [flagAssetActionSummary];

        return asset;
      }

      return null;
    }).filter((asset) => asset != null);
  });
};

module.exports = (context) => ({
  Metrics: {
    get: ({from, to}) => getMetrics(context, {from, to})
  }
});
