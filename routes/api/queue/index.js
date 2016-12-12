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

// Returns back all the comments that are in the moderation queue. The moderation queue is pre or post moderated,
// depending on the settings. The :moderation overwrites this settings.
// Pre-moderation:  New comments are shown in the moderator queues immediately.
// Post-moderation: New comments do not appear in moderation queues unless they are flagged by other users.
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

module.exports = router;
