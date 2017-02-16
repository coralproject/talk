const _ = require('lodash');
const DataLoader = require('dataloader');
const {objectCacheKeyFn} = require('./util');

const CommentModel = require('../../models/comment');
const ActionModel = require('../../models/action');

const getMetrics = ({loaders: {Metrics, Assets}}, {from, to, sort, limit}) => {

  let commentMetrics = {};
  let assetMetrics = [];

  return Metrics.getRecentActions.load({from, to})
    .then((actionSummaries) => {

      commentMetrics = actionSummaries.reduce((acc, {item_id, action_type, count}) => {
        if (!(item_id in acc)) {
          acc[item_id] = [];
        }

        acc[item_id].push({action_type, count});

        return acc;
      }, {});

      // Collect just the comment id's.
      let commentIDs = _.uniq(actionSummaries.map((as) => as.item_id));

      // Find those comments.
      return Metrics.getSpecificComments.loadMany(commentIDs);
    })
    .then((commentResults) => {

      assetMetrics = commentResults.map(({ids, asset_id}) => {
        let summaries = _.groupBy(_.flatten(ids.map((id) => commentMetrics[id])), 'action_type');

        let action_summaries = Object.keys(summaries).map((action_type) => ({
          action_type,
          actionCount: summaries[action_type].reduce((acc, {count}) => acc + count, 0),
          actionableItemCount: summaries[action_type].length
        }));

        return {action_summaries, id: asset_id};
      });

      // Sort these metrics by the predefined sort order. This will ensure that
      // if the action summary does not exist on the object, that it is less
      // prefered over the one that does have it.
      assetMetrics.sort((a, b) => {
        let aActionSummary = a.action_summaries.find((({action_type}) => action_type === sort));
        let bActionSummary = b.action_summaries.find((({action_type}) => action_type === sort));

        // If either a or b don't have this action type, then one of them will
        // automatically win.
        if (aActionSummary == null || bActionSummary == null) {
          if (bActionSummary != null) {
            return 1;
          }

          if (aActionSummary != null) {
            return -1;
          }

          return 0;
        }

        // Both of them had an actionCount, hence we can determine that we could
        // compare the actual values directly.
        return bActionSummary.actionCount - aActionSummary.actionCount;
      });

      // Only keep the top `limit`.
      assetMetrics = assetMetrics.slice(0, limit);

      // Determine the assets that we need to return.
      return Assets.getByID.loadMany(assetMetrics.map((asset) => asset.id));
    })
    .then((assets) => {

      // Join up the assets that are returned by their id.
      let groupedAssets = _.groupBy(assets, 'id');

      // Return from the sorted asset metrics and return their assetes.
      return assetMetrics.map(({id, action_summaries}) => {
        if (id in groupedAssets) {
          let asset = groupedAssets[id][0];

          // Add the action summaries to the asset.
          asset.action_summaries = action_summaries;

          return asset;
        }

        return null;
      }).filter((asset) => asset != null);
    });
};

const getRecentActions = (context, {from, to}) => {
  return ActionModel.aggregate([

    // Find all actions that were created in the time range.
    {$match: {
      item_type: 'COMMENTS',
      created_at: {
        $gt: from,
        $lt: to
      }
    }},

    // Count all those items.
    {$group: {
      _id: {
        item_id: '$item_id',
        action_type: '$action_type'
      },
      count: {
        $sum: 1
      }
    }},

    // Project the count to a better field.
    {$project: {
      item_id: '$_id.item_id',
      action_type: '$_id.action_type',
      count: '$count'
    }}
  ]);
};

const getSpecificComments = (context, ids) => {
  return CommentModel.aggregate([

    // Get only those comments.
    {$match: {
      id: {
        $in: ids
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
};

module.exports = (context) => ({
  Metrics: {
    getSpecificComments: new DataLoader((ids) => getSpecificComments(context, ids)),
    getRecentActions: new DataLoader(([{from, to}]) => getRecentActions(context, {from, to}).then((as) => [as]), {
      batch: false,
      cacheKeyFn: objectCacheKeyFn('from', 'to')
    }),
    get: ({from, to, sort, limit}) => getMetrics(context, {from, to, sort, limit})
  }
});
