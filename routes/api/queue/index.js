const express = require('express');
const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');
const Setting = require('../../../models/setting');
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
  Setting.getModerationSetting().then(({moderation}) =>
    Comment.moderationQueue(moderation))
  .then((comments) => {
    return Promise.all([
      comments,
      User.findByIdArray(_.uniq(comments.map((comment) => comment.author_id))),
      Action.getActionSummaries(_.uniq([
        ...comments.map((comment) => comment.id),
        ...comments.map((comment) => comment.author_id)
      ]))
    ]);
  })
  .then(([comments, users, actions])=>
    res.status(200).json({
      comments,
      users,
      actions
    }))
  .catch(error => {
    next(error);
  });
});

module.exports = router;
