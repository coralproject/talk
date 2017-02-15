const express = require('express');
const errors = require('../../../errors');

const CommentModel = require('../../../models/comment');
const CommentsService = require('../../../services/comments');
const AssetsService = require('../../../services/assets');
const UsersService = require('../../../services/users');
const ActionsService = require('../../../services/actions');

const authorization = require('../../../middleware/authorization');
const _ = require('lodash');

const router = express.Router();

router.get('/', (req, res, next) => {

  const {
    status = null,
    action_type = null,
    asset_id = null,
    user_id = null
  } = req.query;

  // everything on this route requires admin privileges besides listing comments for owner of said comments
  if (!authorization.has(req.user, 'ADMIN') && !user_id) {
    next(errors.ErrNotAuthorized);
    return;
  }

  // if the user is not an admin, only return comment list for the owner of the comments
  if (req.user.id !== user_id && !authorization.has(req.user, 'ADMIN')) {
    next(errors.ErrNotAuthorized);
    return;
  }

  /**
   * This adds the asset_id requirement to the query if the asset_id is defined.
   */
  const assetIDWrap = (query) => {
    if (asset_id) {
      query = query.where('asset_id', asset_id);
    }

    return query;
  };

  let query;

  // the check for user_id MUST be first here.
  // otherwise this will be a vulnerability if you pass user_id and something else,
  // the app will return admin-level data without the proper checks
  if (user_id) {
    query = CommentsService.findByUserId(user_id, authorization.has(req.user, 'ADMIN'));
  } else if (status) {
    query = assetIDWrap(CommentsService.findByStatus(status === 'NEW' ? 'NONE' : status));
  } else if (action_type) {
    query = CommentsService
      .findIdsByActionType(action_type)
      .then((ids) => assetIDWrap(CommentModel.find({
        id: {
          $in: ids
        }
      })));
  } else {
    query = assetIDWrap(CommentsService.all());
  }

  query.then((comments) => {
    return Promise.all([
      comments,
      AssetsService.findMultipleById(comments.map(comment => comment.asset_id)),
      UsersService.findByIdArray(_.uniq(comments.map((comment) => comment.author_id))),
      ActionsService.getActionSummariesFromComments(asset_id, comments, req.user ? req.user.id : false)
    ]);
  })
  .then(([comments, assets, users, actions]) =>
    res.status(200).json({
      comments,
      assets,
      users,
      actions
    }))
  .catch((err) => {
    next(err);
  });
});

router.get('/:comment_id', authorization.needed('ADMIN'), (req, res, next) => {
  CommentsService
    .findById(req.params.comment_id)
    .then(comment => {
      if (!comment) {
        res.status(404).end();
        return;
      }

      res.status(200).json(comment);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/:comment_id', authorization.needed('ADMIN'), (req, res, next) => {
  CommentsService
    .removeById(req.params.comment_id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/:comment_id/status', authorization.needed('ADMIN'), (req, res, next) => {
  const {
    status
  } = req.body;

  CommentsService
    .pushStatus(req.params.comment_id, status, req.user.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
