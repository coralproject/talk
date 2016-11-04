const express = require('express');

const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');

const router = express.Router();

router.get('/', (req, res, next) => {

  const commentsPromise = Comment.findByAssetId(req.query.asset_id);

  commentsPromise.then(comments => {
    return Promise.all([
      comments,
      User.findByIdArray(comments.map((comment) => comment.author_id)),
      Action.findByItemIdArray(comments.map((comment) => comment.id))
    ]);
  }).then(([comments, users, actions]) => {
    res.json([...comments,...users,...actions]);
  }).catch(error => {
    next(error);
  });
});

module.exports = router;
