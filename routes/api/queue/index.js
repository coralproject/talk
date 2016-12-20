const express = require('express');
const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');
const Setting = require('../../../models/setting');
const Asset = require('../../../models/asset');
const _ = require('lodash');

const router = express.Router();

//==============================================================================
// Get Routes
//==============================================================================

// Returns back all the user actions that are in the moderation queue.
router.get('/comments/pending', (req, res, next) => {

  const {
    asset_id
  } = req.query;

  let settings = Setting.retrieve();

  if (asset_id) {

    // In the event that we have an asset_id, we should fetch the asset settings
    // in order to actually determine if there is additional comments to parse.
    settings = Promise.all([
      settings,
      Asset.findById(asset_id).select('settings')
    ]).then(([{moderation}, asset]) => {
      if (asset.settings && asset.settings.moderation) {
        return {moderation: asset.settings.moderation};
      }

      return {moderation};
    });
  }

  settings
    .then(({moderation}) => {
      return Comment.moderationQueue(moderation);
    }).then((comments) => {
      return Promise.all([
        comments,
        User.findByIdArray(_.uniq(comments.map((comment) => comment.author_id))),
        Action.getActionSummaries(_.uniq([
          ...comments.map((comment) => comment.id),
          ...comments.map((comment) => comment.author_id)
        ]))
      ]);
    })
    .then(([comments, users, actions]) => {
      res.json({
        comments,
        users,
        actions
      });
    })
    .catch(error => {
      next(error);
    });
});

// Returns back all the users that are in the moderation queue.
router.get('/users/pending', (req, res, next) => {

  User.moderationQueue()
  .then((users) => {
    return Promise.all([
      users,
      Action.getActionSummaries(users.map((user) => user.id))
    ]);
  })
    .then(([users, actions]) => {
      res.json({
        users,
        actions
      });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
