const { map, get, find, groupBy, property } = require('lodash');
const uuid = require('uuid/v4');
const { UNSUBSCRIBE_SUBJECT } = require('./config');
const { getOrganizationName, getNotificationBody } = require('./util');
const { checkDigests } = require('./digests');

// processNewNotifications will handle notifications that are collected after an
// event hook. These notifications will be batched by user and optionally
// queued for digesting or sent immediately depending on the user's settings.
const processNewNotifications = async (ctx, notifications) =>
  Promise.all(
    map(
      // Group all the notifications so we don't have to redo the digest check
      // multiple times for the same user.
      groupBy(notifications, 'notification.userID'),
      async (notifications, userID) => {
        // Check to see if the user has digesting enabled.
        const hasDigesting = await checkDigests(ctx, userID);
        if (hasDigesting) {
          // User has digesting enabled, queue the notifications to be sent
          // at a later time.
          return queueNotifications(ctx, userID, notifications);
        }

        // User does not have digesting enabled, send the messages the old
        // way.
        return sendNotificationsBatch(ctx, notifications);
      }
    )
  );

// queueNotifications will queue the notifications onto the User.
const queueNotifications = async (ctx, userID, notifications) => {
  // Mutate the notification payloads to what we can store in Mongo safely.
  const digests = notifications.map(
    ({ notification, handler: { category } }) => ({ notification, category })
  );

  // Pull out some useful tools.
  const {
    connectors: {
      models: { User },
    },
  } = ctx;

  ctx.log.info(
    { notifications: notifications.length, userID },
    'now queueing notifications for digesting'
  );

  // Push the digests into Mongo.
  await User.update(
    { id: userID },
    { $push: { 'metadata.notifications.digests': { $each: digests } } }
  );
};

// sendNotificationBatch will send a given set of notifications for several
// users that do not have digesting enabled.
const sendNotificationsBatch = async (ctx, notifications) => {
  // Get the notification name for the subject.
  const organizationName = await getOrganizationName(ctx);
  if (!organizationName) {
    ctx.log.error(
      'could not send the notification, organization name not in settings'
    );
    return;
  }

  return Promise.all(
    map(
      notifications,
      async ({ handler, notification: { userID, context } }) => {
        const {
          connectors: {
            services: {
              I18n: { t },
            },
          },
        } = ctx;
        const { category } = handler;

        // Compose the subject for the email.
        const subject = t(
          `talk-plugin-notifications.categories.${category}.subject`,
          organizationName
        );

        // Load the content into the comment.
        const body = await getNotificationBody(ctx, handler, context);

        // Send the email now.
        return sendNotification(ctx, userID, subject, body);
      }
    )
  );
};

// sendNotification will send the notification to the specified user with the
// given context.
const sendNotification = async (
  ctx,
  userID,
  subject,
  body,
  template = 'notification'
) => {
  const {
    connectors: {
      secrets: { jwt },
      config: { JWT_ISSUER, JWT_AUDIENCE },
      services: { Mailer },
    },
  } = ctx;

  try {
    const organizationName = await getOrganizationName(ctx);
    if (!organizationName) {
      ctx.log.error(
        'could not send the notification, organization name not in settings'
      );
      return;
    }

    // unsubscribeToken is the token used to perform the one-click
    // unsubscribe.
    const unsubscribeToken = jwt.sign({
      jti: uuid(),
      iss: JWT_ISSUER,
      aud: JWT_AUDIENCE,
      sub: UNSUBSCRIBE_SUBJECT,
      user: userID,
    });

    // Send the notification to the user.
    const task = await Mailer.send({
      template,
      locals: { body, organizationName, unsubscribeToken },
      subject,
      user: userID,
    });

    ctx.log.info({ jobID: task.id }, 'sent the notification');
  } catch (err) {
    ctx.log.error(
      { err, message: err.message },
      'could not send the notification, an error occurred'
    );
    return;
  }
};

// filterSuperseded will filter all the possible notifications and only send
// those notifications that are not superseded by another type of notification.
const filterSuperseded = (
  { handler: { category }, notification: { userID: destinationUserID } },
  index,
  notifications
) =>
  !notifications.some(
    ({
      handler: { supersedesCategories = [] },
      notification: { userID: notificationUserID },
    }) =>
      // Only allow notifications to supersede another notification if that
      // notification is also destined for the same user.
      notificationUserID === destinationUserID &&
      // If another notification that is destined for the same user also exists
      // and declares that it supersedes this one, return true so we can filter
      // this one from the list.
      supersedesCategories.some(
        supersededCategory => supersededCategory === category
      )
  );

const USER_CONFIRMATION_QUERY = `
  query CheckUserConfirmation($userID: ID!) {
    user(id: $userID) {
      profiles {
        provider
        ... on LocalUserProfile {
          confirmedAt
        }
      }
    }
  }
`;

// filterVerifiedNotification checks to see if a user has a verified email
// address, and if they do, returns the notification payload again, otherwise,
// returns undefined.
const filterVerifiedNotification = ctx => async notification => {
  // Grab the user that we're supposed to be sending the notification to.
  const {
    notification: { userID },
  } = notification;

  // Check their confirmed status. This should have already been hit by the
  // loaders, so we shouldn't make any more database requests.
  const { errors, data } = await ctx.graphql(USER_CONFIRMATION_QUERY, {
    userID,
  });
  if (errors) {
    ctx.log.error(
      { err: errors },
      'could not query for user confirmation status'
    );
    return;
  }

  // Get the first local profile from the user.
  const profile = find(get(data, 'user.profiles', []), ['provider', 'local']);
  if (!profile) {
    ctx.log.warn({ user_id: userID }, 'user did not have a local profile');
    return;
  }

  // Pull out the confirmed status from the profile.
  const confirmed = get(profile, 'confirmedAt', null) !== null;
  if (!confirmed) {
    ctx.log.info(
      { user_id: userID },
      'user did not have their local profile confirmed, but had settings enabled, not mailing'
    );
    return;
  }

  return notification;
};

// filterVerified performs filtering in a complicated way because we can't use
// Promise.all on a Array.prototype.filter call.
const filterVerified = async (ctx, notifications) => {
  notifications = await Promise.all(
    notifications.map(filterVerifiedNotification(ctx))
  );

  // This acts as a poor-mans identity filter to remove all falsy values.
  return notifications.filter(property('notification'));
};

module.exports = {
  processNewNotifications,
  filterSuperseded,
  filterVerified,
  getNotificationBody,
  sendNotification,
};
