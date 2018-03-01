const { get, find, groupBy, forEach, property } = require('lodash');
const debug = require('debug')('talk-plugin-notifications');
const uuid = require('uuid/v4');
const {
  UNSUBSCRIBE_SUBJECT,
  DISABLE_REQUIRE_EMAIL_VERIFICATIONS,
} = require('./config');

// handleHandlers will call the handle method on each handler to determine if a
// notification should be sent for it.
const handleHandlers = (ctx, handlers, ...args) =>
  Promise.all(
    handlers.map(async handler => {
      // Grab the handler reference.
      const { handle, category, event } = handler;

      try {
        // Attempt to create a notification out of it.
        const notification = await handle(ctx, ...args);
        if (!notification) {
          ctx.log.info('no notification deemed by event handler');
          return;
        }

        // Send the notification back.
        ctx.log.info({ category, event }, 'notification detected for event');
        return { handler, notification };
      } catch (err) {
        ctx.log.error({ err }, 'could not handle the event');
        return;
      }
    })
  );

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
  const { notification: { userID } } = notification;

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

class NotificationManager {
  constructor(context) {
    this.context = context;
    this.registry = [];
  }

  /**
   * register will include the notification handlers on the manager.
   *
   * @param {Array<Object>} handlers notification handlers to register
   */
  register(...handlers) {
    this.registry.push(...handlers);
  }

  /**
   * attach will setup the notifications by walking the registry and loading all
   * the notification types onto the handler.
   *
   * @param {Object} broker the event emitter for the Talk events
   */
  attach(broker) {
    const events = groupBy(this.registry, 'event');

    forEach(events, (handlers, event) => {
      debug(
        `will now notify the [${handlers
          .map(({ category }) => category)
          .join(', ')}] handlers when the '${event}' event is emitted`
      );
      broker.on(event, this.handle(handlers));
    });
  }

  /**
   * handle will wrap a notification handler and attach it to the notification
   * stream system.
   *
   * @param {Object} handler a notification handler
   */
  handle(handlers) {
    return async (...args) => {
      // Create a system context to send down.
      const ctx = this.context.forSystem();

      // Get all the notifications to load.
      let notifications = await handleHandlers(ctx, handlers, ...args);

      // Only let handlers past that have a notification to send.
      notifications = notifications.filter(property('notification'));

      // Check to see if some of the other notifications that are queued
      // had this notification superseded.
      notifications = notifications.filter(filterSuperseded);

      // Only let notifications through for users who have their email addresses
      // verified if we are configured to do so.
      if (!DISABLE_REQUIRE_EMAIL_VERIFICATIONS) {
        notifications = await filterVerified(ctx, notifications);
      }

      // Send the remaining notifications.
      return Promise.all(
        notifications.map(
          ({ handler, notification: { userID, date, context } }) =>
            this.send(ctx, userID, date, handler, context)
        )
      );
    };
  }

  async send(ctx, userID, date, handler, context) {
    const {
      connectors: {
        secrets: { jwt },
        config: { JWT_ISSUER, JWT_AUDIENCE },
        services: { Mailer, I18n: { t } },
      },
      loaders: { Settings },
    } = ctx;
    const { category } = handler;

    try {
      // Get the settings.
      const { organizationName = null } = await Settings.load(
        'organizationName'
      );
      if (organizationName === null) {
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

      // Compose the subject for the email.
      const subject = t(
        `talk-plugin-notifications.categories.${category}.subject`,
        organizationName
      );

      // Load the content into the comment.
      const body = await this.getBody(ctx, handler, context);

      // Send the notification to the user.
      const task = await Mailer.send({
        template: 'notification',
        locals: { body, organizationName, unsubscribeToken },
        subject,
        user: userID,
      });

      ctx.log.info(`Sent the notification for Job.ID[${task.id}]`);
    } catch (err) {
      ctx.log.error(
        { err, message: err.message },
        'could not send the notification, an error occurred'
      );
      return;
    }
  }

  /**
   * getBody will return the body for the notification payload.
   *
   * @param {Object} ctx the graph context
   * @param {Object} handler the notification handler
   * @param {Mixed} context the notification context
   */
  async getBody(ctx, handler, context) {
    const { connectors: { services: { I18n: { t } } } } = ctx;
    const { category, hydrate = () => [] } = handler;

    // Get the body replacement variables for the translation key.
    const replacements = await hydrate(ctx, category, context);

    // Generate the body.
    return t(
      `talk-plugin-notifications.categories.${category}.body`,
      ...replacements
    );
  }
}

module.exports = NotificationManager;
