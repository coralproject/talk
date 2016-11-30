const Comments = require('../../models/comment');
const Users = require('../../models/user');
const Actions = require('../../models/action');
const Assets = require('../../models/asset');
const globals = require('./globals');

/* Create an array of comments */
module.exports.comments = (comments) => Assets.findOrCreateByUrl(globals.baseUrl)
  .then((asset) => {
    comments = comments.map((comment) => {
      comment.asset_id = asset.id;
      return comment;
    });
    return Comments.create(comments);
  });

/* Create an array of users */
module.exports.users = (users) => Users.createLocalUsers(users);

/* Create an array of actions */
module.exports.actions = (actions) => Actions.create(actions);
