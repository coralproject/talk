const express = require('express');
const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');
const authorization = require('../../../middleware/authorization');
const _ = require('lodash');

const router = express.Router();

function gatherActionsAndUsers (comments) {
  return Promise.all([
    comments,
    User.findByIdArray(_.uniq(comments.map((comment) => comment.author_id))),
    Action.getActionSummaries(_.uniq([
      ...comments.map((comment) => comment.id),
      ...comments.map((comment) => comment.author_id)
    ]))
  ]);
}

//==============================================================================
// Get Routes
//==============================================================================

// Returns back all the comments that are in the moderation queue. The moderation queue is pre or post moderated,
// depending on the settings. The :moderation overwrites this settings.
// Pre-moderation:  New comments are shown in the moderator queues immediately.
// Post-moderation: New comments do not appear in moderation queues unless they are flagged by other users.
router.get('/comments/pending', authorization.needed('admin'), (req, res, next) => {

  const {asset_id} = req.query;

  Comment.moderationQueue('premod', asset_id)
    .then(gatherActionsAndUsers)
    .then(([comments, users, actions]) => {
      res.json({comments, users, actions});
    })
    .catch(error => {
      next(error);
    });
});

router.get('/comments/rejected', authorization.needed('admin'), (req, res, next) => {
  const {asset_id} = req.query;

  Comment.moderationQueue('rejected', asset_id)
    .then(gatherActionsAndUsers)
    .then(([comments, users, actions]) => {
      res.json({comments, users, actions});
    })
    .catch(error => {
      next(error);
    });
});

router.get('/comments/flagged', authorization.needed('admin'), (req, res, next) => {
  const {asset_id} = req.query;

  const assetIDWrap = (query) => {
    if (asset_id) {
      query = query.where('asset_id', asset_id);
    }

    return query;
  };

  Comment.findIdsByActionType('flag')
    .then(ids => assetIDWrap(Comment.find({
      id: {$in: ids}
    })))
    .then(gatherActionsAndUsers)
    .then(([comments, users, actions]) => {
      res.json({comments, users, actions});
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
