const { get } = require('lodash');
const path = require('path');

const handle = async (ctx, comment) => {
  if (!comment.visible) {
    ctx.log.info('comment was not visible, not sending notification');
    return;
  }

  // Check to see if this is a reply to an existing comment.
  const parentID = get(comment, 'parent_id', null);
  if (parentID === null) {
    ctx.log.info('could not get parent comment id');
    return;
  }

  const authorID = get(comment, 'author_id', null);
  if (authorID === null) {
    ctx.log.error('could not get author id');
    return;
  }

  // Execute the graph request.
  const reply = await ctx.graphql(
    `
      query GetAuthorUserMetadata($comment_id: ID!, $author_id: ID!) {
        author: user(id: $author_id) {
          role
        }
        comment(id: $comment_id) {
          id
          user {
            id
            notificationSettings {
              onStaffReply
            }
          }
        }
      }
    `,
    { comment_id: parentID, author_id: authorID }
  );
  if (reply.errors) {
    ctx.log.error({ err: reply.errors }, 'could not query for author metadata');
    return;
  }

  // Check if the user has notifications enabled.
  const enabled = get(
    reply,
    'data.comment.user.notificationSettings.onStaffReply',
    false
  );
  if (!enabled) {
    ctx.log.info('onStaffReply is false, will not send the notification');
    return;
  }

  const userID = get(reply, 'data.comment.user.id', null);
  if (!userID) {
    ctx.log.info('could not get parent comment user id');
    return;
  }

  // Check to see if this is yourself replying to yourself, if that's the case
  // don't send a notification.
  if (userID === authorID) {
    ctx.log.info('user id of parent comment is the same as the new comment');
    return;
  }

  // Check to see that this comment was indeed from a staff member.
  const role = get(reply, 'data.author.role');
  if (!['ADMIN', 'MODERATOR', 'STAFF'].includes(role)) {
    ctx.log.info({ role }, 'reply author is not a staff member');
    return;
  }

  // The user does have notifications for replied comments enabled, queue the
  // notification to be sent.
  return { userID, date: comment.created_at, context: comment.id };
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
        settings {
          organizationName
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
  const organizationName = get(reply, 'data.settings.organizationName', null);

  return [headline, replier, organizationName, permalink];
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
  return handle(ctx, comment);
};

module.exports = {
  typeDefs: `
    type NotificationSettings {
      onStaffReply: Boolean!
    }

    input NotificationSettingsInput {
      onStaffReply: Boolean
    }
  `,
  resolvers: {
    NotificationSettings: {
      // onStaffReply returns false by default if not specified.
      onStaffReply: settings => get(settings, 'onStaffReply', false),
    },
  },
  translations: path.join(__dirname, 'translations.yml'),
  notifications: [
    {
      handle,
      category: 'staff',
      event: 'commentAdded',
      hydrate,
      supersedesCategories: ['reply'],
      digestOrder: 20,
    },
    {
      handle: commentAcceptedHandleAdapter,
      category: 'staff',
      event: 'commentAccepted',
      hydrate,
      supersedesCategories: ['reply'],
      digestOrder: 20,
    },
  ],
};
