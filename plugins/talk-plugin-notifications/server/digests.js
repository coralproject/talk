const { get, flatten } = require('lodash');
const { getNotificationBody } = require('./util');

const QUEUE_DIGEST_NOTIFICATION_QUERY = `
  query CheckDigest($userID: ID!) {
    user(id: $userID) {
      notificationSettings {
        digestFrequency
      }
    }
  }
`;

// checkDigests will return a boolean indicating if the user has digesting
// enabled.
const checkDigests = async (ctx, userID) => {
  const { data, errors } = await ctx.graphql(QUEUE_DIGEST_NOTIFICATION_QUERY, {
    userID,
  });
  if (errors) {
    ctx.log.error(
      { err: errors },
      'could not check the digest status of the user, skipping notifications'
    );
    return;
  }

  return get(data, 'user.notificationSettings.digestFrequency') !== 'NONE';
};

// renderDigestMessage will render the notification body value for a digest
// message. It expects that the digestCategories are parsed into a list grouped
// by category with the handler available.
const renderDigestMessage = async (ctx, flattenedDigestCategories) => {
  // Render the messages in this format:
  //
  // [{handler, notifications: [{ context }, ...]}, ...]
  //
  // To:
  //
  // [['body', 'body'], ['body']]
  //
  const notifications = await Promise.all(
    flattenedDigestCategories.map(async ({ handler, notifications }) =>
      Promise.all(
        notifications.map(async ({ context }) =>
          getNotificationBody(ctx, handler, context)
        )
      )
    )
  );

  // Flatten the array of categories:
  //
  // [[..., ...], [..., ...], ...] -> [..., ..., ...]
  //
  return flatten(notifications);
};

module.exports = { renderDigestMessage, checkDigests };
