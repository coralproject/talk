
const express = require('express');
const router = express.Router();

const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');
const Setting = require('../../../models/setting');


// Find all the comments, users, actions by a specific asset_id + settings.
//  . if pre: get the comments that are accepted.
//  . if post: get the comments that are new and accepted.
router.get('/', (req, res, next) => {

  const commentsPromise = Setting.getModerationSetting()
    .then(({moderation}) => {
      switch(moderation){
      case 'pre':
        return Comment.findAcceptedByAssetId(req.query.asset_id);
      case 'post':
        return  Comment.findAcceptedAndNewByAssetId(req.query.asset_id);
      default:
        throw new Error('Moderation setting not found.');
      }
    });

  // Get all the users and actions for those comments + the settings.
  commentsPromise.then(comments => {
    return Promise.all([
      comments,
      User.findByIdArray(comments.map((comment) => comment.author_id)),
      Action.getActionSummaries(comments.map((comment) => comment.id)),
      Setting.getModerationSetting()
    ]);
  }).then(([comments, users, actions, settings]) => {
    res.json({
      comments,
      users,
      actions,
      settings
    });
  }).catch(next);
});

module.exports = router;
