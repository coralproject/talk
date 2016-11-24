const express = require('express');
const Comment = require('../../../models/comment');
const wordlist = require('../../../services/wordlist');

const router = express.Router();

router.get('/', (req, res, next) => {
  let query;

  if (req.query.status) {
    query = Comment.findByStatus(req.query.status);
  } else if (req.query.action_type) {
    query = Comment.findByActionType(req.query.action_type);
  } else if (req.query.user_id) {
    query = Comment.findByUserId(req.query.user_id);
  } else {
    query = Comment.all();
  }

  query.then(comments => {
    res.json(comments);
  })
  .catch((err) => {
    next(err);
  });
});

router.post('/', wordlist.filter('body'), (req, res, next) => {

  const {
    body,
    asset_id,
    parent_id,
    author_id
  } = req.body;

  Comment
    .create({
      body,
      asset_id,
      parent_id,
      status: req.wordlist.matched ? 'rejected' : '',
      author_id
    })
    .then((comment) => {

      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/:comment_id', (req, res, next) => {
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

router.delete('/:comment_id', (req, res, next) => {
  Comment
    .removeById(req.params.comment_id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/:comment_id/status', (req, res, next) => {

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
    user_id,
    action_type
  } = req.body;

  Comment
    .addAction(req.params.comment_id, user_id, action_type)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
