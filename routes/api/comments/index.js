const express = require('express');
const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');
const wordlist = require('../../../services/wordlist');
const authorization = require('../../../middleware/authorization');
const _ = require('lodash');

const router = express.Router();

router.get('/', authorization.needed('admin'), (req, res, next) => {
  let query;

  if (req.query.status) {
    query = Comment.findByStatus(req.query.status);
  } else if (req.query.action_type) {
    query = Comment.findByActionType(req.query.action_type);
  } else {
    query = Comment.all();
  }

  query.then((comments) => {
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
  .catch((err) => {
    next(err);
  });
});

router.post('/', wordlist.filter('body'), (req, res, next) => {

  const {
    body,
    asset_id,
    parent_id
  } = req.body;

  Comment
    .create({
      body,
      asset_id,
      parent_id,
      status: req.wordlist.matched ? 'rejected' : '',
      author_id: req.user.id
    })
    .then((comment) => {

      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/:comment_id', authorization.needed('admin'), (req, res, next) => {
  Comment
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

router.delete('/:comment_id', authorization.needed('admin'), (req, res, next) => {
  Comment
    .removeById(req.params.comment_id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/:comment_id/status', authorization.needed('admin'), (req, res, next) => {
  const {
    status
  } = req.body;

  Comment
    .changeStatus(req.params.comment_id, status)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/:comment_id/actions', (req, res, next) => {

  const {
    action_type
  } = req.body;

  Comment
    .addAction(req.params.comment_id, req.user.id, action_type)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
