const { groupBy, forEach } = require('lodash');
const debug = require('debug')('talk-plugin-notifications');
const uuid = require('uuid/v4');
const { UNSUBSCRIBE_SUBJECT } = require('./config');

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
    return async (...args) =>
      Promise.all(
        handlers.map(async handler => {
          // Grab the handler reference.
          const { handle } = handler;

          // Create a system context to send down.
          const ctx = this.context.forSystem();

          try {
            // Attempt to create a notification out of it.
            const notification = await handle(ctx, ...args);
            if (!notification) {
              return;
            }

            // Extract the notification details.
            const { userID, date, context } = notification;

            // Send the notification.
            return this.send(ctx, userID, date, handler, context);
          } catch (err) {
            ctx.log.error({ err }, 'could not handle the event');
            return;
          }
        })
      );
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
        ctx.log.debug(
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

      ctx.log.debug(`Sent the notification for Job.ID[${task.id}]`);
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
    const { category } = handler;

    // Get the body replacement variables for the translation key.
    const replacements = await handler.hydrate(ctx, category, context);

    // Generate the body.
    return t(
      `talk-plugin-notifications.categories.${category}.body`,
      ...replacements
    );
  }
}

module.exports = NotificationManager;
