const express = require('express');
const router = express.Router();
const register = require('prom-client').register;

const CommentModel = require('../../models/comment');
const UserModel = require('../../models/user');
const AssetModel = require('../../models/asset');
const {
  usersTotalCount,
  anonymousUsersCount
} = require('../../services/metrics/users');
const {
  commentsTotalCount,
  acceptedCommentsCount,
  rejectedCommentsCount
} = require('../../services/metrics/comments');
const {
  assetsTotalCount
} = require('../../services/metrics/assets');

router.get('/', async (req, res) => {

  usersTotalCount.set(await UserModel.count());
  anonymousUsersCount.set(await UserModel.count({'profiles.provider': 'anonymous'}));
  commentsTotalCount.set(await CommentModel.count());
  acceptedCommentsCount.set(await CommentModel.count({status: 'ACCEPTED'}));
  rejectedCommentsCount.set(await CommentModel.count({status: 'REJECTED'}));
  assetsTotalCount.set(await AssetModel.count());

  res.set('Content-Type', register.contentType);
  res.send(register.metrics());
});

module.exports = router;
