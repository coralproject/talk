const { ErrNotAuthorized } = require('../../errors');
const ActionModel = require('../../models/action');
const ActionsService = require('../../services/actions');
const TagsService = require('../../services/tags');
const CommentsService = require('../../services/comments');
const KarmaService = require('../../services/karma');
const merge = require('lodash/merge');

const {
  CREATE_COMMENT,
  SET_COMMENT_STATUS,
  ADD_COMMENT_TAG,
  EDIT_COMMENT,
} = require('../../perms/constants');

const resolveTagsForComment = async (ctx, { asset_id, tags = [] }) => {
  const {
    user,
    loaders: { Tags },
  } = ctx;
  const item_type = 'COMMENTS';

  // Handle Tags
  if (tags.length) {
    // Get the global list of tags from the dataloader.
    let globalTags = await Tags.getAll.load({
      item_type,
      asset_id,
    });
    if (!Array.isArray(globalTags)) {
      globalTags = [];
    }

    // Merge in the tags for the given comment.
    tags = tags.map(name => {
      // Resolve the TagLink that we can use for the comment.
      let { tagLink } = TagsService.resolveLink(user, globalTags, {
        name,
        item_type,
      });

      // Return the tagLink for tag insertion.
      return tagLink;
    });
  }

  // Add the staff tag for comments created as a staff member.
  if (user.can(ADD_COMMENT_TAG)) {
    ctx.log.info({ author_id: user.id }, 'Added staff tag to comment');
    tags.push(
      TagsService.newTagLink(user, {
        name: 'STAFF',
        item_type,
      })
    );
  }

  return tags;
};

/**
 * adjustKarma will adjust the affected user's karma depending on the moderators
 * action.
 */
const adjustKarma = (ctx, Comments, id, status) => async () => {
  try {
    // Use the dataloader to get the comment that was just moderated and
    // get the flag user's id's so we can adjust their karma too.
    let [comment, flagUserIDs] = await Promise.all([
      // Load the comment that was just made/updated by the setCommentStatus
      // operation.
      Comments.get.load(id),

      // Find all the flag actions that were referenced by this comment
      // at this point in time.
      ActionModel.find({
        item_id: id,
        item_type: 'COMMENTS',
        action_type: 'FLAG',
      }).then(actions => {
        // This is to ensure that this is always an array.
        if (!actions) {
          return [];
        }

        return actions.map(({ user_id }) => user_id);
      }),
    ]);

    ctx.log.info(
      {
        state: {
          comment_id: id,
          author_id: comment.author_id,
          status: status,
        },
      },
      'Processing karma modification'
    );

    switch (status) {
      case 'REJECTED':
        // Reduce the user's karma.
        ctx.log.info('Comment author had their karma reduced');

        // Decrease the flag user's karma, the moderator disagreed with this
        // action.
        ctx.log.info(
          { flagUserIDs },
          'Flagging users had their karma increased'
        );
        await Promise.all([
          KarmaService.modifyUser(comment.author_id, -1, 'comment'),
          KarmaService.modifyUser(flagUserIDs, 1, 'flag', true),
        ]);

        break;

      case 'ACCEPTED':
        // Increase the user's karma.
        ctx.log.info('Comment author had their karma increased');

        // Increase the flag user's karma, the moderator agreed with this
        // action.
        ctx.log.info({ flagUserIDs }, `Flagging users had their karma reduced`);
        await Promise.all([
          KarmaService.modifyUser(comment.author_id, 1, 'comment'),
          KarmaService.modifyUser(flagUserIDs, -1, 'flag', true),
        ]);

        break;
      default:
        return;
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
const createComment = async (
  ctx,
  {
    tags = [],
    body,
    asset_id,
    parent_id = null,
    status = 'NONE',
    metadata = {},
  }
) => {
  const {
    user,
    loaders: { Comments },
    pubsub,
  } = ctx;

  // Resolve the tags for the comment.
  tags = await resolveTagsForComment(ctx, { asset_id, tags });

  let comment = await CommentsService.publicCreate({
    body,
    asset_id,
    parent_id,
    status,
    tags,
    author_id: user.id,
    metadata,
  });

  ctx.log.info(
    { comment_id: comment.id, comment_status: status },
    'Created comment'
  );

  // If the loaders are present, clear the caches for these values because we
  // just added a new comment, hence the counts should be updated. We should
  // perform these increments in the event that we do have a new comment that
  // is approved or without a comment.
  if (status === 'NONE' || status === 'ACCEPTED') {
    if (parent_id === null) {
      Comments.parentCountByAssetID.incr(asset_id);
    }
    Comments.countByAssetID.incr(asset_id);
  }

  // Publish the newly added comment via the subscription.
  pubsub.publish('commentAdded', comment);

  return comment;
};

/**
 * createPublicComment is designed to create a comment from a public source. It
 * validates the comment, and performs some automated moderator actions based on
 * the settings.
 * @param  {Object} ctx      the graphql context
 * @param  {Object} commentInput the new comment to be created
 * @return {Promise}             resolves to a new comment
 */
const createPublicComment = async (ctx, comment) => {
  const {
    connectors: {
      services: { Moderation },
    },
  } = ctx;

  // We then take the wordlist and the comment into consideration when
  // considering what status to assign the new comment, and resolve the new
  // status to set the comment to.
  let { actions, status } = await Moderation.process(ctx, comment);

  // Assign status to comment.
  comment.status = status;

  // Then we actually create the comment with the new status.
  const result = await createComment(ctx, comment);

  // Create all the actions that were determined during the moderation check
  // phase.
  await createActions(result.id, actions);

  // Finally, we return the comment.
  return result;
};

// createActions will for each of the provided actions, create the given action
// on the comment at the same time using Promise.all.
const createActions = async (item_id, actions = []) =>
  Promise.all(
    actions
      .map(action =>
        merge(action, {
          item_id,
          item_type: 'COMMENTS',
        })
      )
      .map(action => ActionsService.create(action))
  );

/**
 * Sets the status of a comment
 * @param  {Object} ctx graphql context
 * @param {String} comment     comment in graphql context
 * @param {String} id          identifier of the comment  (uuid)
 * @param {String} status      the new status of the comment
 */
const setStatus = async (ctx, { id, status }) => {
  const {
    user,
    loaders: { Comments },
  } = ctx;

  let comment = await CommentsService.pushStatus(
    id,
    status,
    user ? user.id : null
  );

  // If the loaders are present, clear the caches for these values because we
  // just added a new comment, hence the counts should be updated. It would
  // be nice if we could decrement the counters here, but that would result
  // in us having to know the initial state of the comment, which would
  // require another database query.
  if (comment.parent_id === null) {
    Comments.parentCountByAssetID.clear(comment.asset_id);
  }

  Comments.countByAssetID.clear(comment.asset_id);

  // postSetCommentStatus will use the arguments from the mutation and
  // adjust the affected user's karma in the next tick.
  process.nextTick(adjustKarma(ctx, Comments, id, status));

  return comment;
};

/**
 * Edit a Comment
 * @param {String} id         identifier of the comment  (uuid)
 * @param {Object} edit       describes how to edit the comment
 * @param {String} edit.body  the new Comment body
 */
const editComment = async (
  ctx,
  {
    id,
    asset_id,
    edit: {
      body,
      metadata = {},
      status: commentStatus,
      actions: commentActions = [],
    },
  }
) => {
  const {
    connectors: {
      services: { Moderation },
    },
  } = ctx;

  // Build up the new comment we're setting. We need to check this with
  // moderation now.
  let comment = {
    id,
    asset_id,
    body,
    status: commentStatus,
    actions: commentActions,
  };

  // Determine the new status of the comment.
  const { actions, status } = await Moderation.process(ctx, comment);

  // Execute the edit.
  comment = await CommentsService.edit({
    id,
    author_id: ctx.user.id,
    body,
    status,
    metadata,
  });

  // Create all the actions that were determined during the moderation check
  // phase.
  await createActions(comment.id, actions);

  // Publish the edited comment via the subscription.
  ctx.pubsub.publish('commentEdited', comment);

  return comment;
};

module.exports = ctx => {
  let mutators = {
    Comment: {
      create: () => Promise.reject(new ErrNotAuthorized()),
      setStatus: () => Promise.reject(new ErrNotAuthorized()),
      edit: () => Promise.reject(new ErrNotAuthorized()),
    },
  };

  if (ctx.user && ctx.user.can(CREATE_COMMENT)) {
    mutators.Comment.create = comment => createPublicComment(ctx, comment);
  }

  if (ctx.user && ctx.user.can(SET_COMMENT_STATUS)) {
    mutators.Comment.setStatus = action => setStatus(ctx, action);
  }

  if (ctx.user && ctx.user.can(EDIT_COMMENT)) {
    mutators.Comment.edit = action => editComment(ctx, action);
  }

  return mutators;
};
