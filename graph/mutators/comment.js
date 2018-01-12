const errors = require('../../errors');
const ActionModel = require('../../models/action');
const AssetsService = require('../../services/assets');
const ActionsService = require('../../services/actions');
const TagsService = require('../../services/tags');
const CommentsService = require('../../services/comments');
const KarmaService = require('../../services/karma');
const merge = require('lodash/merge');
const linkify = require('linkify-it')().tlds(require('tlds'));
const Wordlist = require('../../services/wordlist');
const {
  CREATE_COMMENT,
  SET_COMMENT_STATUS,
  ADD_COMMENT_TAG,
  EDIT_COMMENT,
} = require('../../perms/constants');
const debug = require('debug')('talk:graph:mutators:comment');
const {
  DISABLE_AUTOFLAG_SUSPECT_WORDS,
  IGNORE_FLAGS_AGAINST_STAFF,
} = require('../../config');

const resolveTagsForComment = async (
  { user, loaders: { Tags } },
  { asset_id, tags = [] }
) => {
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
const adjustKarma = (Comments, id, status) => async () => {
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

    debug(`Comment[${id}] by User[${comment.author_id}] was Status[${status}]`);

    switch (status) {
      case 'REJECTED':
        // Reduce the user's karma.
        debug(`CommentUser[${comment.author_id}] had their karma reduced`);

        // Decrease the flag user's karma, the moderator disagreed with this
        // action.
        debug(
          `FlaggingUser[${flagUserIDs.join(', ')}] had their karma increased`
        );
        await Promise.all([
          KarmaService.modifyUser(comment.author_id, -1, 'comment'),
          KarmaService.modifyUser(flagUserIDs, 1, 'flag', true),
        ]);

        break;

      case 'ACCEPTED':
        // Increase the user's karma.
        debug(`CommentUser[${comment.author_id}] had their karma increased`);

        // Increase the flag user's karma, the moderator agreed with this
        // action.
        debug(
          `FlaggingUser[${flagUserIDs.join(', ')}] had their karma reduced`
        );
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
  context,
  {
    tags = [],
    body,
    asset_id,
    parent_id = null,
    status = 'NONE',
    metadata = {},
  }
) => {
  const { user, loaders: { Comments }, pubsub } = context;

  // Resolve the tags for the comment.
  tags = await resolveTagsForComment(context, { asset_id, tags });

  let comment = await CommentsService.publicCreate({
    body,
    asset_id,
    parent_id,
    status,
    tags,
    author_id: user.id,
    metadata,
  });

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
 * Filters the comment object and outputs wordlist results.
 * @param  {Object} context graphql context
 * @param  {String} body        body of a comment
 * @param  {String} [asset_id]  id of asset comment is posted on
 * @return {Object}         resolves to the wordlist results
 */
const filterNewComment = async (context, { body, asset_id }) => {
  // Load the settings.
  const [settings, asset] = await Promise.all([
    context.loaders.Settings.load(),
    context.loaders.Assets.getByID.load(asset_id),
  ]);

  // Create a new instance of the Wordlist.
  const wl = new Wordlist();

  // Load the wordlist.
  wl.upsert(settings.wordlist);

  // Load the wordlist and filter the comment content.
  return [
    // Scan the word.
    wl.scan('body', body),

    // Return the asset's settings.
    await AssetsService.rectifySettings(asset, settings),
  ];
};

/**
 * moderationPhases is an array of phases carried out in order until a status is
 * returned.
 */
const moderationPhases = [
  // This phase checks to see if the comment is long enough.
  (context, comment) => {
    // Check to see if the body is too short, if it is, then complain about it!
    if (comment.body.length < 2) {
      throw errors.ErrCommentTooShort;
    }
  },

  // This phase checks to see if the asset being processed is closed or not.
  (context, comment, { asset }) => {
    // Check to see if the asset has closed commenting...
    if (asset.isClosed) {
      throw new errors.ErrAssetCommentingClosed(asset.closedMessage);
    }
  },

  // This phase checks the comment against the wordlist.
  (context, comment, { wordlist }) => {
    // Decide the status based on whether or not the current asset/settings
    // has pre-mod enabled or not. If the comment was rejected based on the
    // wordlist, then reject it, otherwise if the moderation setting is
    // premod, set it to `premod`.
    if (wordlist.banned) {
      // Add the flag related to Trust to the comment.
      return {
        status: 'REJECTED',
        actions: [
          {
            action_type: 'FLAG',
            user_id: null,
            group_id: 'BANNED_WORD',
            metadata: {},
          },
        ],
      };
    }

    // If the comment has a suspect word or a link, we need to add a
    // flag to it to indicate that it needs to be looked at.
    // Otherwise just return the new comment.

    // If the wordlist has matched the suspect word filter and we haven't disabled
    // auto-flagging suspect words, then we should flag the comment!
    if (wordlist.suspect && !DISABLE_AUTOFLAG_SUSPECT_WORDS) {
      // TODO: this is kind of fragile, we should refactor this to resolve
      // all these const's that we're using like 'COMMENTS', 'FLAG' to be
      // defined in a checkable schema.
      return {
        actions: [
          {
            action_type: 'FLAG',
            user_id: null,
            group_id: 'SUSPECT_WORD',
            metadata: {},
          },
        ],
      };
    }
  },

  // This phase checks to see if the comment's length exceeds maximum.
  (context, comment, { assetSettings: { charCountEnable, charCount } }) => {
    // Reject if the comment is too long
    if (charCountEnable && comment.body.length > charCount) {
      // Add the flag related to Trust to the comment.
      return {
        status: 'REJECTED',
        actions: [
          {
            action_type: 'FLAG',
            user_id: null,
            group_id: 'BODY_COUNT',
            metadata: {
              count: comment.body.length,
            },
          },
        ],
      };
    }
  },

  // If a given user is a staff member, always approve their comment.
  context => {
    if (IGNORE_FLAGS_AGAINST_STAFF && context.user && context.user.isStaff()) {
      return {
        status: 'ACCEPTED',
      };
    }
  },

  // This phase checks the comment if it has any links in it if the check is
  // enabled.
  (context, comment, { assetSettings: { premodLinksEnable } }) => {
    if (premodLinksEnable && linkify.test(comment.body)) {
      // Add the flag related to Trust to the comment.
      return {
        status: 'SYSTEM_WITHHELD',
        actions: [
          {
            action_type: 'FLAG',
            user_id: null,
            group_id: 'LINKS',
            metadata: {
              links: comment.body,
            },
          },
        ],
      };
    }
  },

  // This phase checks to see if the user making the comment is allowed to do so
  // considering their reliability (Trust) status.
  context => {
    if (context.user && context.user.metadata) {
      // If the user is not a reliable commenter (passed the unreliability
      // threshold by having too many rejected comments) then we can change the
      // status of the comment to `SYSTEM_WITHHELD`, therefore pushing the user's
      // comments away from the public eye until a moderator can manage them. This of
      // course can only be applied if the comment's current status is `NONE`,
      // we don't want to interfere if the comment was rejected.
      if (
        KarmaService.isReliable('comment', context.user.metadata.trust) ===
        false
      ) {
        // Add the flag related to Trust to the comment.
        return {
          status: 'SYSTEM_WITHHELD',
          actions: [
            {
              action_type: 'FLAG',
              user_id: null,
              group_id: 'TRUST',
              metadata: {
                trust: context.user.metadata.trust,
              },
            },
          ],
        };
      }
    }
  },

  // This phase checks to see if the comment was already prescribed a status.
  (context, comment) => {
    // If the status was already defined, don't redefine it. It's only defined
    // when specific external conditions exist, we don't want to override that.
    if (comment.status && comment.status.length > 0) {
      return {
        status: comment.status,
      };
    }
  },

  // This phase checks to see if the settings have premod enabled, if they do,
  // the comment is premod, otherwise, it's just none.
  (context, comment, { assetSettings: { moderation } }) => {
    // If the settings say that we're in premod mode, then the comment is in
    // premod status.
    if (moderation === 'PRE') {
      return {
        status: 'PREMOD',
      };
    }

    return {
      status: 'NONE',
    };
  },
];

/**
 * This resolves a given comment's status and actions.
 * @param  {Object} context graphql context
 * @param  {String} body          body of the comment
 * @param  {String} [asset_id]    asset for the comment
 * @param  {Object} [wordlist={}] the results of the wordlist scan
 * @return {Promise}              resolves to the comment's status and actions
 */
const resolveCommentModeration = async (context, comment) => {
  // First we filter the comment contents to ensure that we note any validation
  // issues.
  let [wordlist, settings] = await filterNewComment(context, comment);

  // Get the asset from the loader.
  const asset = await context.loaders.Assets.getByID.load(comment.asset_id);
  if (!asset) {
    // And leave now if this asset wasn't found.
    throw errors.ErrNotFound;
  }

  // Combine the asset and the settings to get the asset settings.
  const assetSettings = await AssetsService.rectifySettings(asset, settings);

  let actions = comment.actions || [];

  // Loop over all the moderation phases and see if we've resolved the status.
  for (const phase of moderationPhases) {
    const result = await phase(context, comment, {
      asset,
      assetSettings,
      settings,
      wordlist,
    });

    if (result) {
      if (result.actions) {
        actions.push(...result.actions);
      }

      // If this result contained a status, then we've finished resolving
      // phases!
      if (result.status) {
        return { status: result.status, actions };
      }
    }
  }
};

/**
 * createPublicComment is designed to create a comment from a public source. It
 * validates the comment, and performs some automated moderator actions based on
 * the settings.
 * @param  {Object} context      the graphql context
 * @param  {Object} commentInput the new comment to be created
 * @return {Promise}             resolves to a new comment
 */
const createPublicComment = async (context, comment) => {
  // We then take the wordlist and the comment into consideration when
  // considering what status to assign the new comment, and resolve the new
  // status to set the comment to.
  let { actions, status } = await resolveCommentModeration(context, comment);

  // Assign status to comment.
  comment.status = status;

  // Then we actually create the comment with the new status.
  const result = await createComment(context, comment);

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
 * @param  {Object} context graphql context
 * @param {String} comment     comment in graphql context
 * @param {String} id          identifier of the comment  (uuid)
 * @param {String} status      the new status of the comment
 */
const setStatus = async ({ user, loaders: { Comments } }, { id, status }) => {
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
  process.nextTick(adjustKarma(Comments, id, status));

  return comment;
};

/**
 * Edit a Comment
 * @param {String} id         identifier of the comment  (uuid)
 * @param {Object} edit       describes how to edit the comment
 * @param {String} edit.body  the new Comment body
 */
const edit = async (context, { id, asset_id, edit: { body } }) => {
  // Build up the new comment we're setting. We need to check this with
  // moderation now.
  let comment = { id, asset_id, body };

  // Determine the new status of the comment.
  const { actions, status } = await resolveCommentModeration(context, comment);

  // Execute the edit.
  comment = await CommentsService.edit({
    id,
    author_id: context.user.id,
    body,
    status,
  });

  // Create all the actions that were determined during the moderation check
  // phase.
  await createActions(comment.id, actions);

  // Publish the edited comment via the subscription.
  context.pubsub.publish('commentEdited', comment);

  return comment;
};

module.exports = context => {
  let mutators = {
    Comment: {
      create: () => Promise.reject(errors.ErrNotAuthorized),
      setStatus: () => Promise.reject(errors.ErrNotAuthorized),
      edit: () => Promise.reject(errors.ErrNotAuthorized),
    },
  };

  if (context.user && context.user.can(CREATE_COMMENT)) {
    mutators.Comment.create = comment => createPublicComment(context, comment);
  }

  if (context.user && context.user.can(SET_COMMENT_STATUS)) {
    mutators.Comment.setStatus = action => setStatus(context, action);
  }

  if (context.user && context.user.can(EDIT_COMMENT)) {
    mutators.Comment.edit = action => edit(context, action);
  }

  return mutators;
};
