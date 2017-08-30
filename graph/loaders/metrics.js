const _ = require('lodash');
const DataLoader = require('dataloader');
const {objectCacheKeyFn} = require('./util');

const ActionModel = require('../../models/action');
const CommentModel = require('../../models/comment');

/**
 * Returns the assets which have had comments made within the last time period.
 */
const getAssetActivityMetrics = ({loaders: {Assets}}, {from, to, limit}) => {
  let assetMetrics = [];

  return CommentModel.aggregate([
    {$match: {
      parent_id: null,
      created_at: {
        $gt: from,
        $lt: to
      }
    }},
    {$group: {
      _id: '$asset_id',
      commentCount: {
        $sum: 1
      }
    }},
    {$project: {
      _id: false,
      asset_id: '$_id',
      commentCount: '$commentCount'
    }},
    {$sort: {
      commentCount: -1
    }},
    {$limit: limit}
  ])
    .then((results) => {
      assetMetrics = results;

      return Assets.getByID.loadMany(results.map((result) => result.asset_id));
    })
    .then((assets) => assets.map((asset, i) => {

    // We're leveraging the fact that the comments returned by the aggregation
    // query are in the request order that we just made, it's what the
    // Assets.getByID loader does.
      asset.commentCount = assetMetrics[i].commentCount;

      return asset;
    }));
};

/**
 * Returns a list of assets with action metadata included on the models.
 */
const getAssetMetrics = async ({loaders: {Metrics, Assets, Comments}}, {from, to, sortBy, limit}) => {

  // Get the recent actions.
  let actionSummaries = await Metrics.getRecentActions.load({from, to});

  let commentMetrics = actionSummaries.reduce((acc, {item_id, action_type, count}) => {
    if (action_type !== sortBy) {
      return acc;
    }

    if (!(item_id in acc)) {
      acc[item_id] = [];
    }

    acc[item_id].push({action_type, count});

    return acc;
  }, {});

  // Collect just the comment id's.
  let commentIDs = Object.keys(commentMetrics);

  // Find those comments.
  let comments = await Comments.get.loadMany(commentIDs);

  let commentResults = _.groupBy(comments, 'asset_id');

  let assetMetrics = Object.keys(commentResults)
    .map((asset_id) => {
      let ids = commentResults[asset_id].map((comment) => comment.id);
      let summaries = _.groupBy(_.flatten(ids.map((id) => commentMetrics[id])), 'action_type');

      let action_summaries = Object.keys(summaries).map((action_type) => ({
        action_type,
        actionCount: summaries[action_type].reduce((acc, {count}) => acc + count, 0),
        actionableItemCount: summaries[action_type].length
      }));

      return {action_summaries, id: asset_id};
    })

    .filter((asset) => {
      let contextActionSummary = asset.action_summaries.find((({action_type}) => action_type === sortBy));
      if (contextActionSummary === null || contextActionSummary.actionCount === 0) {
        return false;
      }

      return true;
    })

    // Sort these metrics by the predefined sort order. This will ensure that
    // if the action summary does not exist on the object, that it is less
    // prefered over the one that does have it.
    .sort((a, b) => {
      let aActionSummary = a.action_summaries.find((({action_type}) => action_type === sortBy));
      let bActionSummary = b.action_summaries.find((({action_type}) => action_type === sortBy));

      // Both of them had an actionCount, hence we can determine that we could
      // compare the actual values directly.
      return bActionSummary.actionCount - aActionSummary.actionCount;
    });

  // Only keep the top `limit`.
  assetMetrics = assetMetrics.slice(0, limit);

  // Determine the assets that we need to return.
  let assets = await Assets.getByID.loadMany(assetMetrics.map((asset) => asset.id));

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
};

/**
 * Returns a list of comments that are retrieved based on most activity within
 * the indicated time range.
 */
const getCommentMetrics = async ({loaders: {Metrics, Comments}}, {from, to, sortBy, limit}) => {

  let commentActionSummaries = {};

  let actionSummaries = await Metrics.getRecentActions.load({from, to});

  actionSummaries.sort((a, b) => {
    let aActionSummary = a.action_type === sortBy ? a : null;
    let bActionSummary = b.action_type === sortBy ? b : null;

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
    return bActionSummary.count - aActionSummary.count;
  });

  commentActionSummaries = _.groupBy(actionSummaries, 'item_id');

  // Grab the comment id's for comment where they have at least one of the
  // actions being sorted by.
  let commentIDs = Object.keys(commentActionSummaries).filter((item_id) => {
    let contextActionSummary = commentActionSummaries[item_id].find(({action_type}) => action_type === sortBy);
    if (contextActionSummary == null) {
      return false;
    }

    return true;
  });

  // Only keep the top `limit`.
  commentIDs = commentIDs.slice(0, limit);

  // If there are no comment's to get, then just continue with an empty
  // array.
  if (commentIDs.length === 0) {
    return [];
  }

  // Find those comments, this is the final stage, so let's get all the
  // fields.
  let comments = await Comments.get.loadMany(commentIDs);

  return comments.map((comment) => {

    // Add in the action summaries genrerated.
    comment.action_summaries = commentActionSummaries[comment.id];

    return comment;
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

module.exports = (context) => ({
  Metrics: {
    getRecentActions: new DataLoader(([{from, to}]) => getRecentActions(context, {from, to}).then((as) => [as]), {
      batch: false,
      cacheKeyFn: objectCacheKeyFn('from', 'to')
    }),
    Assets: {
      get: ({from, to, sortBy, limit}) => getAssetMetrics(context, {from, to, sortBy, limit}),
      getActivity: ({from, to, limit}) => getAssetActivityMetrics(context, {from, to, limit}),
    },
    Comments: {
      get: ({from, to, sortBy, limit}) => getCommentMetrics(context, {from, to, sortBy, limit}),
    }
  }
});
