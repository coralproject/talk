const express = require('express');

const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');

const Setting = require('../../../models/setting');

const router = express.Router();

// Find all the comments by a specific asset_id.
//  . if pre: get the comments that are accepted.
//  . if post: get the comments that are new and accepted.
router.get('/', (req, res, next) => {
  const commentsPromise = Setting.getModerationSetting().then(({moderation}) => {
    switch(moderation){
    case 'pre':
      return Comment.findAcceptedByAssetId(req.query.asset_id);
    case 'post':
      return  Comment.findAcceptedAndNewByAssetId(req.query.asset_id);
    default:
      throw new Error('Moderation setting not found.');
    }
  });

  // Get all the users and actions for those comments.
  commentsPromise.then(comments => {
    return Promise.all([
      comments,
      User.findByIdArray(comments.map((comment) => comment.author_id)),
      Action.findByItemIdArray(comments.map((comment) => comment.id))
    ]);
  }).then(([comments, users, actions]) => {
    res.status(200).json([...comments, ...users, ...actions]);
  }).catch(error => {
    next(error);
  });
});

module.exports = router;
