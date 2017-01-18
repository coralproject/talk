const errors = require('../../../errors');

const Asset = require('../../../models/asset');
const Comment = require('../../../models/comment');

const Wordlist = require('../../../services/wordlist');

/**
 * Creates a new comment.
 * @param  {Object} context       a GraphQL context
 * @param  {String} body          body of the comment
 * @param  {String} asset_id      asset for the comment
 * @param  {String} parent_id     optional parent of the comment
 * @param  {Object} [wordlist={}] results for the wordlist analysis
 * @return {Promise}              resolves to the created comment
 */
const createComment = (context, {body, asset_id, parent_id = null}, wordlist = {}) => {

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
    author_id: context.req.user.id
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
 * Filters the comment and outputs the wordlist results.
 * @param  {[type]} context [description]
 * @param  {[type]} comment [description]
 * @return {[type]}         [description]
 */
const filterNewComment = (context, comment) => {

  // Create a new instance of the Wordlist.
  const wl = new Wordlist();

  // Load the wordlist and filter the comment content.
  return wl.load().then(() => wl.filter(comment, 'body'));
};

module.exports = (context) => ({
  createComment: (comment) => filterNewComment(context, comment).then((wordlist) => {
    return createComment(context, comment, wordlist);
  })
});
