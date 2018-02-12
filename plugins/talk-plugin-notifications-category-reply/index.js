const { graphql } = require('graphql');
const { get } = require('lodash');
const path = require('path');

const handle = async (ctx, comment) => {
  const { connectors: { graph: { schema } } } = ctx;

  // Check to see if this is a reply to an existing comment.
  const parentID = get(comment, 'parent_id', null);
  if (parentID === null) {
    ctx.log.debug('could not get parent comment id');
    return;
  }

  // Execute the graph request.
  const reply = await graphql(
    schema,
    `
      query GetAuthorUserMetadata($comment_id: ID!) {
        comment(id: $comment_id) {
          id
          user {
            id
            notificationSettings {
              onReply
            }
          }
        }
      }
    `,
    {},
    ctx,
    { comment_id: parentID }
  );
  if (reply.errors) {
    console.error(reply.errors);
    return;
  }

  // TODO: re-enable.
  // // Check if the user has notifications enabled.
  // const enabled = get(
  //   reply,
  //   'data.comment.user.notificationSettings.onReply',
  //   false
  // );
  // if (!enabled) {
  //   return;
  // }

  const userID = get(reply, 'data.comment.user.id', null);
  if (!userID) {
    ctx.log.debug('could not get parent comment user id');
    return;
  }

  // Check to see if this is yourself replying to yourself, if that's the case
  // don't send a notification.
  if (userID === get(comment, 'author_id')) {
    ctx.log.debug('user id of parent comment is the same as the new comment');
    return;
  }

  // The user does have notifications for replied comments enabled, queue the
  // notification to be sent.
  return { userID, date: comment.created_at, context: comment.id };
};

const hydrate = async (ctx, category, context) => {
  const { connectors: { graph: { schema } } } = ctx;

  const reply = await graphql(
    schema,
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
    {},
    ctx,
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

const handler = { handle, category: 'reply', event: 'commentAdded', hydrate };

module.exports = {
  translations: path.join(__dirname, 'translations.yml'),
  notifications: [handler],
};
