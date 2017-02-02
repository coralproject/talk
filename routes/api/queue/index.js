const express = require('express');
const CommentsService = require('../../../services/comments');
const CommentModel = require('../../../models/comment');
const UsersService = require('../../../services/users');
const ActionsService = require('../../../services/actions');
const authorization = require('../../../middleware/authorization');
const _ = require('lodash');

const router = express.Router();

function gatherActionsAndUsers (comments) {
  return Promise.all([
    comments,
    UsersService.findByIdArray(_.uniq(comments.map((comment) => comment.author_id))),
    ActionsService.getActionSummaries(_.uniq([
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
router.get('/comments/premod', authorization.needed('ADMIN'), (req, res, next) => {

  const {asset_id} = req.query;

  CommentsService.moderationQueue('PREMOD', asset_id)
    .then(gatherActionsAndUsers)
    .then(([comments, users, actions]) => {
      res.json({comments, users, actions});
    })
    .catch(error => {
      next(error);
    });
});

router.get('/comments/rejected', authorization.needed('ADMIN'), (req, res, next) => {
  const {asset_id} = req.query;

  CommentsService.moderationQueue('REJECTED', asset_id)
    .then(gatherActionsAndUsers)
    .then(([comments, users, actions]) => {
      res.json({comments, users, actions});
    })
    .catch(error => {
      next(error);
    });
});

router.get('/comments/flagged', authorization.needed('ADMIN'), (req, res, next) => {
  const {asset_id} = req.query;

  const assetIDWrap = (query) => {
    if (asset_id) {
      query = query.where('asset_id', asset_id);
    }

    return query;
  };

  CommentsService.findIdsByActionType('FLAG')
    .then(ids => assetIDWrap(CommentModel.find({
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

// Returns back all the users that are in the moderation queue.
router.get('/users/pending', (req, res, next) => {
  UsersService.moderationQueue()
  .then((users) => {
    return Promise.all([
      users,
      ActionsService.getActionSummaries(users.map((user) => user.id))
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
