const errors = require('../errors');

const Action = require('../models/action');
const Asset = require('../models/asset');
const Comment = require('../models/comment');
const User = require('../models/user');

const Wordlist = require('../services/wordlist');

/**
 * Creates a new comment.
 * @param  {Object} user          the user performing the request
 * @param  {String} body          body of the comment
 * @param  {String} asset_id      asset for the comment
 * @param  {String} parent_id     optional parent of the comment
 * @param  {String} [status=null] the status of the new comment
 * @return {Promise}              resolves to the created comment
 */
const createComment = ({user}, {body, asset_id, parent_id = null}, status = null) => {
  return Comment.publicCreate({
    body,
    asset_id,
    parent_id,
    status,
    author_id: user.id
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
 * This resolves a given comment's status to take into account moderator actions
 * are applied.
 * @param  {Object} context       graphql context
 * @param  {String} body          body of the comment
 * @param  {String} asset_id      asset for the comment
 * @param  {Object} [wordlist={}] the results of the wordlist scan
 * @return {Promise}              resolves to the comment's status
 */
const resolveNewCommentStatus = (context, {asset_id, body}, wordlist = {}) => {

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

  return status;
};

/**
 * createPublicComment is designed to create a comment from a public source. It
 * validates the comment, and performs some automated moderator actions based on
 * the settings.
 * @param  {Object} context      the graphql context
 * @param  {Object} commentInput the new comment to be created
 * @return {Promise}             resolves to a new comment
 */
const createPublicComment = (context, commentInput) => {

  // First we filter the comment contents to ensure that we note any validation
  // issues.
  return filterNewComment(context, commentInput)

    // We then take the wordlist and the comment into consideration when
    // considering what status to assign the new comment, and resolve the new
    // status to set the comment to.
    .then((wordlist) => resolveNewCommentStatus(context, commentInput, wordlist)

      // Then we actually create the comment with the new status.
      .then((status) => createComment(context, commentInput, status))
      .then((comment) => {

        // If the comment was flagged as being suspect, we need to add a
        // flag to it to indicate that it needs to be looked at.
        // Otherwise just return the new comment.
        if (wordlist != null && wordlist.suspect) {

          // TODO: this is kind of fragile, we should refactor this to resolve
          // all these const's that we're using like 'comments', 'flag' to be
          // defined in a checkable schema.
          return createAction(null, {
            item_id: comment.id,
            item_type: 'comments',
            action_type: 'flag',
            metadata: {
              field: 'body',
              details: 'Matched suspect word filters.'
            }
          }).then(() => comment);
        }

        // Finally, we return the comment.
        return comment;
      }));
};

/**
 * Creates an action on a item.
 * @param  {Object} user        the user performing the request
 * @param  {String} item_id     id of the item to add the action to
 * @param  {String} item_type   type of the item
 * @param  {String} action_type type of the action
 * @return {Promise}            resolves to the action created
 */
const createAction = ({user = {}}, {item_id, item_type, action_type, metadata = {}}) => {
  return Action.insertUserAction({
    item_id,
    item_type,
    user_id: user.id,
    action_type,
    metadata
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
 * @param  {Object} user the user performing the request
 * @param  {String} bio  the new user bio
 * @return {Promise}
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
        create: (comment) => createPublicComment(context, comment)
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
