const express = require('express');

const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');

const router = express.Router();

router.get('/', (req, res, next) => {

  const comments = Comment.findByAssetId(req.query.asset_id);
  const users = User.findByIdArray(comments.map((comment) => comment.author_id));
  const actions = Action.findByItemIdArray(comments.map((comment) => comment.id));

  Promise.all([comments, users, actions]).then(([comments, users, actions]) => {
    res.json([...comments,...users,...actions]);
  }).catch(error => {
    next(error);
  });

});

module.exports = router;
