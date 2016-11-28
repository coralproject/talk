const express = require('express');
const _ = require('lodash');

const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');
const Asset = require('../../../models/asset');

const Setting = require('../../../models/setting');

const router = express.Router();

// Find all the comments by a specific asset_url.
//  . if pre: get the comments that are accepted.
//  . if post: get the comments that are new and accepted.
router.get('/', (req, res, next) => {

  // Get the asset_id for this url (or create it if it doesn't exist)
  Promise.all([
    Asset.findOrCreateByUrl(decodeURIComponent(req.query.asset_url)),
    Setting.getSettings()
  ])
  .then(([asset, settings]) => {
    // Get the sitewide moderation setting and return the appropriate comments
    switch(settings.moderation){
    case 'pre':
      return Promise.all([Comment.findAcceptedByAssetId(asset.id), asset, settings]);
    case 'post':
      return Promise.all([Comment.findAcceptedAndNewByAssetId(asset.id), asset, settings]);
    default:
      return Promise.reject(new Error('Moderation setting not found.'));
    }
  })
  // Get all the users and actions for those comments.
  .then(([comments, asset, settings]) => {
    return Promise.all([
      [asset],
      comments,
      User.findByIdArray(_.uniq(comments.map((comment) => comment.author_id))),
      Action.getActionSummaries(_.uniq([
        asset.id,
        ...comments.map((comment) => comment.id),
        ...comments.map((comment) => comment.author_id)
      ])),
      settings
    ]);
  })
  .then(([assets, comments, users, actions, settings]) => {
    res.json({
      assets,
      comments,
      users,
      actions,
      settings
    });
  })
  .catch(error => {
    next(error);
  });
});

module.exports = router;
