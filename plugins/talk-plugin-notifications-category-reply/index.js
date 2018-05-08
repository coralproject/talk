const { get, map } = require('lodash');
const path = require('path');

const commentAddedHandler = async (ctx, comment) => {
  // Check to see if this reply is visible.
  if (!comment.visible) {
    ctx.log.info(
      { commentID: comment.id },
      'comment was not visible, not sending notification'
    );
    return;
  }

  // Check to see if this is a reply to an existing comment.
  const parentID = get(comment, 'parent_id', null);
  if (!parentID) {
    ctx.log.info(
      { commentID: comment.id },
      'could not get parent comment id, comment must be a top level comment'
    );
    return;
  }

  // Execute the graph request.
  const reply = await ctx.graphql(
    `
      query GetAuthorUserMetadata($comment_id: ID!) {
        comment(id: $comment_id) {
          id
          user {
            id
            ignoredUsers {
              id
            }
            notificationSettings {
              onReply
            }
          }
        }
      }
    `,
    { comment_id: parentID }
  );
  if (reply.errors) {
    ctx.log.error({ err: reply.errors }, 'could not query for author metadata');
    return;
  }

  const parentComment = get(reply, 'data.comment');
  if (!parentComment) {
    ctx.log.info({ parentID }, 'could not get parent comment');
    return;
  }

  // Check if the user has notifications enabled.
  const enabled = get(
    parentComment,
    'user.notificationSettings.onReply',
    false
  );
  if (!enabled) {
    ctx.log.error(
      'parent comment author does not have notification category enabled'
    );
    return;
  }

  const parentAuthor = get(parentComment, 'user', null);
  if (!parentAuthor) {
    ctx.log.info('could not get parent author');
    return;
  }

  // Pull out the author of the new comment. This was outputted from Mongo, so
  // we have to pull it out of the `author_id` field.
  const authorID = get(comment, 'author_id');

  // Check to see if this is yourself replying to yourself, if that's the case
  // don't send a notification.
  if (parentAuthor.id === authorID) {
    ctx.log.info('user id of parent comment is the same as the new comment');
    return;
  }

  // Check to see if this user is ignoring the user who replied to their
  // comment.
  const ignoredUsers = map(get(parentAuthor, 'ignoredUsers', []), 'id');
  if (ignoredUsers.includes(authorID)) {
    ctx.log.info(
      { parentAuthorID: parentAuthor.id, authorID },
      'parent user has ignored the author of the new comment'
    );
    return;
  }

  // The user does have notifications for replied comments enabled, queue the
  // notification to be sent.
  return {
    userID: parentAuthor.id,
    date: comment.created_at,
    context: comment.id,
  };
};

const hydrate = async (ctx, category, context) => {
  const reply = await ctx.graphql(
    `
      query GetNotificationData($context: ID!) {
        comment(id: $context) {
          id
          asset {
            title
            url
          }
          user {
            username
          }
        }
      }
    `,
    { context }
  );
  if (reply.errors) {
    throw reply.errors;
  }

  const comment = get(reply, 'data.comment');
  const headline = get(comment, 'asset.title', null);
  const replier = get(comment, 'user.username', null);
  const assetURL = get(comment, 'asset.url', null);
  const permalink = `${assetURL}?commentId=${comment.id}`;

  return [headline, replier, permalink];
};

// commentAcceptedHandleAdapter will check to see if we need to send a
// notification for this comment if the comment has been recently approved but
// has not been approved before.
const commentAcceptedHandleAdapter = (ctx, comment) => {
  // Don't send a notification for a non-visible comment.
  if (!comment.visible) {
    ctx.log.info('comment was not visible, not sending notification');
    return;
  }

  // Don't send a notification if the comment was previously visible.
  if (
    // TODO: (wyattjoh) this check is quite brittle, replace with a more concrete check.
    comment.status_history
      .slice(0, comment.status_history.length - 1)
      .some(({ type }) => ['ACCEPTED', 'NONE'].includes(type))
  ) {
    ctx.log.info(
      'comment was previously already visible, not sending another notification'
    );
    return;
  }

  // Delegate to the handle function.
  return commentAddedHandler(ctx, comment);
};

module.exports = {
  typeDefs: `
    type NotificationSettings {
      onReply: Boolean!
    }

    input NotificationSettingsInput {
      onReply: Boolean
    }
  `,
  resolvers: {
    NotificationSettings: {
      // onReply returns false by default if not specified.
      onReply: settings => get(settings, 'onReply', false),
    },
  },
  translations: path.join(__dirname, 'translations.yml'),
  notifications: [
    {
      handle: commentAddedHandler,
      category: 'reply',
      event: 'commentAdded',
      hydrate,
      digestOrder: 30,
    },
    {
      handle: commentAcceptedHandleAdapter,
      category: 'reply',
      event: 'commentAccepted',
      hydrate,
      digestOrder: 30,
    },
  ],
};
