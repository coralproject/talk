const debug = require('debug')('talk:graph:mutators:comment');
const errors = require('../../errors');

const ActionModel = require('../../models/action');
const AssetsService = require('../../services/assets');
const ActionsService = require('../../services/actions');
const CommentsService = require('../../services/comments');
const KarmaService = require('../../services/karma');
const linkify = require('linkify-it')();

const Wordlist = require('../../services/wordlist');
const {
  CREATE_COMMENT,
  SET_COMMENT_STATUS,
  ADD_COMMENT_TAG,
  REMOVE_COMMENT_TAG,
  EDIT_COMMENT
} = require('../../perms/constants');

/**
 * adjustKarma will adjust the affected user's karma depending on the moderators
 * action.
 */
const adjustKarma = (Comments, id, status) => async () => {
  try {

    // Use the dataloader to get the comment that was just moderated and
    // get the flag user's id's so we can adjust their karma too.
    let [
      comment,
      flagUserIDs
    ] = await Promise.all([

      // Load the comment that was just made/updated by the setCommentStatus
      // operation.
      Comments.get.load(id),

      // Find all the flag actions that were referenced by this comment
      // at this point in time.
      ActionModel.find({
        item_id: id,
        item_type: 'COMMENTS',
        action_type: 'FLAG'
      }).then((actions) => {

        // This is to ensure that this is always an array.
        if (!actions) {
          return [];
        }

        return actions.map(({user_id}) => user_id);
      })
    ]);

    debug(`Comment[${id}] by User[${comment.author_id}] was Status[${status}]`);

    switch (status) {
    case 'REJECTED':

      // Reduce the user's karma.
      debug(`CommentUser[${comment.author_id}] had their karma reduced`);

      // Decrease the flag user's karma, the moderator disagreed with this
      // action.
      debug(`FlaggingUser[${flagUserIDs.join(', ')}] had their karma increased`);
      await Promise.all([
        KarmaService.modifyUser(comment.author_id, -1, 'comment'),
        KarmaService.modifyUser(flagUserIDs, 1, 'flag', true)
      ]);

      break;

    case 'ACCEPTED':

      // Increase the user's karma.
      debug(`CommentUser[${comment.author_id}] had their karma increased`);

      // Increase the flag user's karma, the moderator agreed with this
      // action.
      debug(`FlaggingUser[${flagUserIDs.join(', ')}] had their karma reduced`);
      await Promise.all([
        KarmaService.modifyUser(comment.author_id, 1, 'comment'),
        KarmaService.modifyUser(flagUserIDs, -1, 'flag', true)
      ]);

      break;

    }

    return;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Creates a new comment.
 * @param  {Object} user          the user performing the request
 * @param  {String} body          body of the comment
 * @param  {String} asset_id      asset for the comment
 * @param  {String} parent_id     optional parent of the comment
 * @param  {String} [status='NONE'] the status of the new comment
 * @return {Promise}              resolves to the created comment
 */
const createComment = async ({user, loaders: {Comments}, pubsub}, {body, asset_id, parent_id = null, tags = []}, status = 'NONE') => {

  // Building array of tags
  tags = tags.map((tag) => ({name: tag}));

  // If admin or moderator, adding STAFF tag
  if (user.isStaff()) {
    tags.push({name: 'STAFF'});
  }

  let comment = await CommentsService.publicCreate({
    body,
    asset_id,
    parent_id,
    status,
    tags,
    author_id: user.id
  });

  // If the loaders are present, clear the caches for these values because we
  // just added a new comment, hence the counts should be updated. We should
  // perform these increments in the event that we do have a new comment that
  // is approved or without a comment.
  if (status === 'NONE' || status === 'APPROVED') {
    if (parent_id != null) {
      Comments.countByParentID.incr(parent_id);
    } else {
      Comments.parentCountByAssetID.incr(asset_id);
    }
    Comments.countByAssetID.incr(asset_id);

    if (pubsub) {

      // Publish the newly added comment via the subscription.
      pubsub.publish('commentAdded', comment);
    }
  }

  return comment;
};

/**
 * Filters the comment object and outputs wordlist results.
 * @param  {Object} context graphql context
 * @param  {String} body        body of a comment
 * @param  {String} [asset_id]  id of asset comment is posted on
 * @return {Object}         resolves to the wordlist results
 */
const filterNewComment = (context, {body, asset_id}) => {

  // Create a new instance of the Wordlist.
  const wl = new Wordlist();

  // Load the wordlist and filter the comment content.
  return Promise.all([
    wl.load().then(() => wl.scan('body', body)),
    asset_id && AssetsService.rectifySettings(AssetsService.findById(asset_id))
  ]);
};

/**
 * This resolves a given comment's status to take into account moderator actions
 * are applied.
 * @param  {Object} context graphql context
 * @param  {String} body          body of the comment
 * @param  {String} [asset_id]    asset for the comment
 * @param  {Object} [wordlist={}] the results of the wordlist scan
 * @return {Promise}              resolves to the comment's status
 */
const resolveNewCommentStatus = async (context, {asset_id, body}, wordlist = {}, settings = {}) => {
  let {user} = context;

  // Check to see if the body is too short, if it is, then complain about it!
  if (body.length < 2) {
    throw errors.ErrCommentTooShort;
  }

  // Decide the status based on whether or not the current asset/settings
  // has pre-mod enabled or not. If the comment was rejected based on the
  // wordlist, then reject it, otherwise if the moderation setting is
  // premod, set it to `premod`.
  if (wordlist.banned) {
    return 'REJECTED';
  }

  if (settings.premodLinksEnable && linkify.test(body)) {
    return 'PREMOD';
  }

  let asset = await AssetsService.findById(asset_id);
  if (!asset) {
    throw errors.ErrNotFound;
  }

  // Check to see if the asset has closed commenting...
  if (asset.isClosed) {
    throw new errors.ErrAssetCommentingClosed(asset.closedMessage);
  }

  // Return `premod` if pre-moderation is enabled and an empty "new" status
  // in the event that it is not in pre-moderation mode.
  let {moderation, charCountEnable, charCount} = await AssetsService.rectifySettings(asset);

  // Reject if the comment is too long
  if (charCountEnable && body.length > charCount) {
    return 'REJECTED';
  }

  if (user && user.metadata) {

    // If the user is not a reliable commenter (passed the unreliability
    // threshold by having too many rejected comments) then we can change the
    // status of the comment to `PREMOD`, therefore pushing the user's comments
    // away from the public eye until a moderator can manage them. This of
    // course can only be applied if the comment's current status is `NONE`,
    // we don't want to interfere if the comment was rejected.
    if (KarmaService.isReliable('comment', user.metadata.trust) === false) {

      // Update the response from the comment creation to add the PREMOD so that
      // that user's UI will reflect the fact that their comment is in pre-mod.
      return 'PREMOD';
    }
  }

  return moderation === 'PRE' ? 'PREMOD' : 'NONE';
};

/**
 * createPublicComment is designed to create a comment from a public source. It
 * validates the comment, and performs some automated moderator actions based on
 * the settings.
 * @param  {Object} context      the graphql context
 * @param  {Object} commentInput the new comment to be created
 * @return {Promise}             resolves to a new comment
 */
const createPublicComment = async (context, commentInput) => {

  // First we filter the comment contents to ensure that we note any validation
  // issues.
  let [wordlist, settings] = await filterNewComment(context, commentInput);

  // We then take the wordlist and the comment into consideration when
  // considering what status to assign the new comment, and resolve the new
  // status to set the comment to.
  let status = await resolveNewCommentStatus(context, commentInput, wordlist, settings);

  // Then we actually create the comment with the new status.
  let comment = await createComment(context, commentInput, status);

  // If the comment has a suspect word or a link, we need to add a
  // flag to it to indicate that it needs to be looked at.
  // Otherwise just return the new comment.

  // TODO: Check why the wordlist is undefined
  if (wordlist != null && wordlist.suspect != null) {

    // TODO: this is kind of fragile, we should refactor this to resolve
    // all these const's that we're using like 'COMMENTS', 'FLAG' to be
    // defined in a checkable schema.
    await ActionsService.insertUserAction({
      item_id: comment.id,
      item_type: 'COMMENTS',
      action_type: 'FLAG',
      user_id: null,
      group_id: 'Matched suspect word filter',
      metadata: {}
    });
  }

  // Finally, we return the comment.
  return comment;
};

/**
 * Sets the status of a comment
 * @param  {Object} context graphql context
 * @param {String} comment     comment in graphql context
 * @param {String} id          identifier of the comment  (uuid)
 * @param {String} status      the new status of the comment
 */
const setStatus = async ({user, loaders: {Comments}}, {id, status}) => {
  let comment = await CommentsService.pushStatus(id, status, user ? user.id : null);

  // If the loaders are present, clear the caches for these values because we
  // just added a new comment, hence the counts should be updated. It would
  // be nice if we could decrement the counters here, but that would result
  // in us having to know the initial state of the comment, which would
  // require another database query.
  if (comment.parent_id != null) {
    Comments.countByParentID.clear(comment.parent_id);
  } else {
    Comments.parentCountByAssetID.clear(comment.asset_id);
  }

  Comments.countByAssetID.clear(comment.asset_id);

  // postSetCommentStatus will use the arguments from the mutation and
  // adjust the affected user's karma in the next tick.
  process.nextTick(adjustKarma(Comments, id, status));

  return comment;
};

/**
 * Adds a tag to a Comment
 * @param {String} id          identifier of the comment  (uuid)
 * @param {String} tag     name of the tag
 */
const addCommentTag = ({user, loaders: {Comments}}, {id, tag}) => {
  return CommentsService.addTag(id, tag, user.id);
};

/**
 * Removes a tag from a Comment
 * @param {String} id      identifier of the comment  (uuid)
 * @param {String} tag     name of the tag
 */
const removeCommentTag = ({user, loaders: {Comments}}, {id, tag}) => {
  return CommentsService.removeTag(id, tag);
};

/**
 * Edit a Comment
 * @param {String} id         identifier of the comment  (uuid)
 * @param {Object} edit       describes how to edit the comment
 * @param {String} edit.body  the new Comment body
 */
const edit = async (context, {id, asset_id, edit: {body}}) => {

  // Get the wordlist and the settings object.
  const [wordlist, settings] = await filterNewComment(context, {asset_id, body});

  // Determine the new status of the comment.
  const status = await resolveNewCommentStatus(context, {asset_id, body}, wordlist, settings);

  // Execute the edit.
  const comment = await CommentsService.edit(id, context.user.id, {body, status});

  if (context.pubsub) {

    // Publish the edited comment via the subscription.
    context.pubsub.publish('commentEdited', comment);
  }

  return comment;
};

module.exports = (context) => {
  let mutators = {
    Comment: {
      create: () => Promise.reject(errors.ErrNotAuthorized),
      setStatus: () => Promise.reject(errors.ErrNotAuthorized),
      addCommentTag: () => Promise.reject(errors.ErrNotAuthorized),
      removeCommentTag: () => Promise.reject(errors.ErrNotAuthorized),
      edit: () => Promise.reject(errors.ErrNotAuthorized),
    }
  };

  if (context.user && context.user.can(CREATE_COMMENT)) {
    mutators.Comment.create = (comment) => createPublicComment(context, comment);
  }

  if (context.user && context.user.can(SET_COMMENT_STATUS)) {
    mutators.Comment.setStatus = (action) => setStatus(context, action);
  }

  if (context.user && context.user.can(ADD_COMMENT_TAG)) {
    mutators.Comment.addCommentTag = (action) => addCommentTag(context, action);
  }

  if (context.user && context.user.can(REMOVE_COMMENT_TAG)) {
    mutators.Comment.removeCommentTag = (action) => removeCommentTag(context, action);
  }

  if (context.user && context.user.can(EDIT_COMMENT)) {
    mutators.Comment.edit = (action) => edit(context, action);
  }

  return mutators;
};
