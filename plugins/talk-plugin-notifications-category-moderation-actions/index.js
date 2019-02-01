const { get } = require('lodash');
const path = require('path');

const { MODERATION_NOTIFICATION_TYPES } = require('./config');

const UNPUBLISHED_STATUS_TYPES = ['PREMOD', 'SYSTEM_WITHHELD'];

const handle = async (ctx, comment) => {
  const commentID = get(comment, 'id', null);
  if (commentID === null) {
    ctx.log.info('could not get comment id');
    return;
  }

  // Check to see if this is a previously unpublished comment.
  const commentHistory = get(comment, 'status_history', []);
  // Check for last status before current one
  const lastStatus = commentHistory[commentHistory.length - 2];
  const previouslyUnpublished = UNPUBLISHED_STATUS_TYPES.includes(
    lastStatus && lastStatus.type
  );

  if (!previouslyUnpublished) {
    ctx.log.info('comment was not previously unpublished');
    return;
  }

  // Execute the graph request.
  const commentQl = await ctx.graphql(
    `
      query GetAuthorUserMetadata($comment_id: ID!) {
        comment(id: $comment_id) {
          id
          user {
            id
            notificationSettings {
              onModeration
            }
          }
        }
      }
    `,
    { comment_id: commentID }
  );
  if (commentQl.errors) {
    ctx.log.error(
      { err: commentQl.errors },
      'could not query for author metadata'
    );
    return;
  }

  // Check if the user has notifications enabled.
  const enabled = get(
    commentQl,
    'data.comment.user.notificationSettings.onModeration',
    false
  );
  if (!enabled) {
    return;
  }

  const userID = get(commentQl, 'data.comment.user.id', null);
  if (!userID) {
    ctx.log.info('could not get comment user id');
    return;
  }

  // The user does have notifications for moderated comments enabled, queue the
  // notification to be sent.
  return { userID, date: comment.created_at, context: comment.id };
};

const hydrate = async (ctx, category, context) => {
  const comment = await ctx.graphql(
    `
      query GetNotificationData($context: ID!) {
        comment(id: $context) {
          id
          asset {
            title
            url
          }
          status_history {
            type
          }
        }
      }
    `,
    { context }
  );
  if (comment.errors) {
    throw comment.errors;
  }

  const commentData = get(comment, 'data.comment');

  const headline = get(commentData, 'asset.title', null);
  const assetURL = get(commentData, 'asset.url', null);
  const permalink = `${assetURL}?commentId=${commentData.id}`;
  return [headline, permalink];
};

const handlers = {
  approved: {
    handle,
    category: 'moderation-actions.approved',
    event: 'commentAccepted',
    hydrate,
    digestOrder: 10,
  },
  rejected: {
    handle,
    category: 'moderation-actions.rejected',
    event: 'commentRejected',
    hydrate,
    digestOrder: 10,
  },
};

const notifications = [];
MODERATION_NOTIFICATION_TYPES.forEach(type =>
  notifications.push(handlers[type.toLowerCase()])
);

module.exports = {
  typeDefs: `
    type NotificationSettings {
      onModeration: Boolean!
    }

    input NotificationSettingsInput {
      onModeration: Boolean
    }
  `,
  resolvers: {
    NotificationSettings: {
      // onModeration returns false by default if not specified.
      onModeration: settings => get(settings, 'onModeration', false),
    },
  },
  translations: path.join(__dirname, 'translations.yml'),
  notifications,
};
