const {
  merge,
  map,
  get,
  find,
  groupBy,
  forEach,
  flatten,
  property,
} = require('lodash');
const debug = require('debug')('talk-plugin-notifications');
const { DISABLE_REQUIRE_EMAIL_VERIFICATIONS } = require('./config');
const { CronJob } = require('cron');
const { getOrganizationName } = require('./util');
const {
  processNewNotifications,
  filterSuperseded,
  filterVerified,
  sendNotification,
} = require('./messages');
const { renderDigestMessage } = require('./digests');

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
          ctx.log.info(
            { category, event },
            'no notification deemed by event handler'
          );
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

class NotificationManager {
  constructor(context) {
    this.context = context;
    this.registry = [];
    this.digests = [];
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
      broker.on(event, this.handleUserEvent(handlers));
    });
  }

  /**
   * registerDigests will register the digest handlers.
   *
   * @param {Array<Object>} handlers digest handlers for options related to digesting
   */
  registerDigests(...handlers) {
    this.digests.push(...handlers);
  }

  /**
   * startDigesting will register all the digests to run and setup the cron
   * jobs.
   */
  startDigesting() {
    this.digests.forEach(({ frequency, config }) => {
      new CronJob(
        merge(config, {
          start: true,
          onTick: this.handleDigestEvent(frequency),
        })
      );
    });
  }

  handleDigestEvent(frequency) {
    return async () => {
      // Create a system context to send down.
      const ctx = this.context.forSystem();

      try {
        // Pull out some useful tools.
        const {
          connectors: {
            models: { User },
            services: {
              I18n: { t },
            },
          },
        } = ctx;

        const organizationName = await getOrganizationName(ctx);
        if (!organizationName) {
          ctx.log.error(
            'could not send the notification, organization name not in settings'
          );
          return;
        }

        const subject = t(
          'talk-plugin-notifications.templates.digest.subject',
          organizationName
        );

        // Continue to pull from the Users digest until the queue is empty.
        while (true) {
          // Pull notifications from a user that have notifications enabled for
          // `frequency` and currently have notifications.
          const user = await User.findOneAndUpdate(
            {
              'metadata.notifications.settings.digestFrequency': frequency,
              'metadata.notifications.digests': { $exists: true, $ne: [] },
            },
            { $set: { 'metadata.notifications.digests': [] } }
          );
          if (!user) {
            // There are no more users that meet the search criteria! We're
            // done!
            ctx.log.info('no notifications from database');
            break;
          }

          // Begin rendering the user's digest.
          const digests = get(user, 'metadata.notifications.digests');
          if (!digests) {
            // We couldn't get the digest from the user (even after Mongo said
            // we would get it?).
            ctx.log.info(
              { userID: user.id },
              'no notifications from user in database'
            );
            continue;
          }

          ctx.log.info(
            { userID: user.id, notifications: digests.length },
            'generating notification digest email'
          );

          const flattenedDigestCategories = this.flattenDigests(ctx, digests);

          // Get all the notifications together.
          const allMessages = await renderDigestMessage(
            ctx,
            flattenedDigestCategories
          );

          // Send the email with the digested body.
          await sendNotification(
            ctx,
            user.id,
            subject,
            flatten(allMessages),
            'notification-digest'
          );
        }
      } catch (err) {
        ctx.log.error({ err }, 'could not handle digests');
      }
    };
  }

  flattenDigests(ctx, digests) {
    // Digests are store in the database like:
    //
    // [{ notification: { userID, date, context }, category }, ...]
    //
    // So lets group our notifications by category, creating the
    // following:
    //
    // {[category]: [{notification: { userID, date, context }}, ...], ...}
    //
    const groupedDigests = groupBy(digests, 'category');

    // Lets attach the handler reference onto each of these, so we
    // transform it again to the following:
    //
    // [{ handler, notifications: [{ userID, date, context }]}]
    //
    return Object.keys(groupedDigests)
      .map(category => {
        // Get the handler.
        const handler = find(this.registry, ['category', category]);
        if (!handler) {
          ctx.log.info({ category }, 'notification category not found');
          return;
        }
        // Get the notifications.
        const notifications = map(get(groupedDigests, category), digests =>
          get(digests, 'notification')
        );

        return { notifications, handler };
      })
      .filter(digest => digest)
      .sort((a, b) => {
        const aDigestOrder = get(a, 'handler.digestOrder', 0);
        const bDigestOrder = get(b, 'handler.digestOrder', 0);
        if (aDigestOrder < bDigestOrder) {
          return -1;
        }
        if (aDigestOrder > bDigestOrder) {
          return 1;
        }
        return 0;
      });
  }

  /**
   * handleUserEvent will wrap a notification handler and attach it to the
   * notification stream system.
   *
   * @param {Object} handler a notification handler
   */
  handleUserEvent(handlers) {
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
      return processNewNotifications(ctx, notifications);
    };
  }
}

module.exports = NotificationManager;
