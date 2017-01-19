const errors = require('../../../errors');

const Action = require('../../../models/action');
const Asset = require('../../../models/asset');
const Comment = require('../../../models/comment');
const User = require('../../../models/user');

const Wordlist = require('../../../services/wordlist');

/**
 * Creates a new comment.
 * @param  {Object} user          the user performing the request
 * @param  {String} body          body of the comment
 * @param  {String} asset_id      asset for the comment
 * @param  {String} parent_id     optional parent of the comment
 * @param  {Object} [wordlist={}] results for the wordlist analysis
 * @return {Promise}              resolves to the created comment
 */
const createComment = ({user}, {body, asset_id, parent_id = null}, wordlist = {}) => {

  // Decide the status based on whether or not the current asset/settings
  // has pre-mod enabled or not. If the comment was rejected based on the
  // wordlist, then reject it, otherwise if the moderation setting is
  // premod, set it to `premod`.
  let status;

  if (wordlist.banned) {
    status = Promise.resolve('rejected');
  } else {
    status = Asset
      .rectifySettings(Asset.findById(asset_id).then((asset) => {
        if (!asset) {
          return Promise.reject(errors.ErrNotFound);
        }

        // Check to see if the asset has closed commenting...
        if (asset.isClosed) {

          // They have, ensure that we send back an error.
          return Promise.reject(new errors.ErrAssetCommentingClosed(asset.closedMessage));
        }

        return asset;
      }))

      // Return `premod` if pre-moderation is enabled and an empty "new" status
      // in the event that it is not in pre-moderation mode.
      .then(({moderation, charCountEnable, charCount}) => {

        // Reject if the comment is too long
        if (charCountEnable && body.length > charCount) {
          return 'rejected';
        }
        return moderation === 'pre' ? 'premod' : null;
      });
  }

  return status.then((status) => Comment.publicCreate({
    body,
    asset_id,
    parent_id,
    status,
    author_id: user.id
  }))
  .then((comment) => {
    if (wordlist.suspect) {
      return Comment
        .addAction(comment.id, null, 'flag', {field: 'body', details: 'Matched suspect word filters.'})
        .then(() => comment);
    }

    return comment;
  });
};

/**
 * Filters the comment object and outputs wordlist results.
 * @param  {Object} context graphql context
 * @param  {String} body    body of a comment
 * @return {Object}         resolves to the wordlist results
 */
const filterNewComment = (context, {body}) => {

  // Create a new instance of the Wordlist.
  const wl = new Wordlist();

  // Load the wordlist and filter the comment content.
  return wl.load().then(() => wl.scan('body', body));
};

/**
 * Creates an action on a item.
 * @param  {Object} user the user performing the request
 * @param  {String} item_id     id of the item to add the action to
 * @param  {String} item_type   type of the item
 * @param  {String} action_type type of the action
 * @return {Promise}            resolves to the action created
 */
const createAction = ({user}, {item_id, item_type, action_type}) => {
  return Action.insertUserAction({
    item_id,
    item_type,
    user_id: user.id,
    action_type
  });
};

/**
 * Deletes an action based on the user id if the user owns that action.
 * @param  {Object} user the user performing the request
 * @param  {[type]} id   [description]
 * @return {[type]}      [description]
 */
const deleteAction = ({user}, {id}) => {
  return Action.remove({
    id,
    user_id: user.id
  });
};

/**
 * Updates a users settings.
 * @param  {[type]} user [description]
 * @param  {[type]} bio  [description]
 * @return {[type]}      [description]
 */
const updateUserSettings = ({user}, {bio}) => {
  return User.updateSettings(user.id, {bio});
};

module.exports = (context) => {

  // TODO: refactor to something that'll return an error in the event an attempt
  // is made to mutate state while not logged in. There's got to be a better way
  // to do this.
  if (context.user) {
    return {
      Comment: {
        create: (comment) => filterNewComment(context, comment).then((wordlist) => {
          return createComment(context, comment, wordlist);
        })
      },
      Action: {
        create: (action) => createAction(context, action),
        delete: (action) => deleteAction(context, action)
      },
      User: {
        updateSettings: (settings) => updateUserSettings(context, settings)
      }
    };
  }

  return {
    Comment: {
      create: () => {}
    },
    Action: {
      create: () => {},
      delete: () => {}
    },
    User: {
      updateSettings: () => {}
    }
  };
};
