const DataLoader = require('dataloader');
const _ = require('lodash');

const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');
const Asset = require('../../../models/asset');
const Settings = require('../../../models/setting');

class SingletonResolver {
  constructor(resolver) {
    this._cache = null;
    this._resolver = resolver;
  }

  load() {
    if (this._cache) {
      return this._cache;
    }

    let promise = this._resolver(arguments).then((result) => {
      return result;
    });

    // Set the promise on the cache.
    this._cache = promise;

    return promise;
  }
}

const arrayJoinBy = (ids, key) => (items) => {
  const itemsByKey = _.groupBy(items, key);
  return ids.map((id) => {
    if (id in itemsByKey) {
      return itemsByKey[id];
    }

    return [];
  });
};

const singleJoinBy = (ids, key) => (items) => {
  const itemsByKey = _.groupBy(items, key);
  return ids.map((id) => {
    if (id in itemsByKey) {
      return itemsByKey[id][0];
    }

    return null;
  });
};

const genAssetByID = (ids) => Asset.find({
  id: {
    $in: ids
  }
}).then(singleJoinBy(ids, 'id'));

const genActionsByID = (ids, user = {}) => Action.getActionSummaries(ids, user.id).then(arrayJoinBy(ids, 'item_id'));

const genCommentsByAssetID = (ids) => Comment.find({
  asset_id: {
    $in: ids
  },
  parent_id: null,
  status: {
    $in: [null, 'accepted']
  }
}).then(arrayJoinBy(ids, 'asset_id'));

const genCommentsByParentID = (ids) => Comment.find({
  parent_id: {
    $in: ids
  },
  status: {
    $in: [null, 'accepted']
  }
}).then(arrayJoinBy(ids, 'parent_id'));

module.exports = (context) => ({
  Comments: {
    getByParentID: new DataLoader((ids) => genCommentsByParentID(ids)),
    getByAssetID: new DataLoader((ids) => genCommentsByAssetID(ids)),
  },
  Actions: {
    getByID: new DataLoader((ids) => genActionsByID(ids, context.req.user)),
  },
  Users: {
    getByID: new DataLoader((ids) => User.findByIdArray(ids))
  },
  Assets: {
    getByID: new DataLoader((ids) => genAssetByID(ids)),
    getAll: new SingletonResolver(() => Asset.find({}))
  },
  Settings: new SingletonResolver(() => Settings.retrieve())
});
