const debug = require('debug')('talk-plugin-notifications');
const path = require('path');
const linkify = require('linkifyjs/html');
const NotificationManager = require('./NotificationManager');
const { map, reduce } = require('lodash');

module.exports = connectors => {
  const {
    graph: {
      subscriptions: { getBroker },
      Context,
    },
    services: { Mailer, Plugins },
  } = connectors;

  // Setup the mailer. Other plugins registered before this one can replace the
  // notification template by passing the same name + format for the template
  // registration.
  ['notification', 'notification-digest'].forEach(name => {
    ['txt', 'html'].forEach(format => {
      Mailer.templates.register(
        path.join(__dirname, 'emails', `${name}.${format}.ejs`),
        name,
        format
      );
    });
  });
  // Register the mail helpers. You can register your own helpers by calling
  // this function in another plugin.
  Mailer.registerHelpers({ linkify });

  // Get the handle for the broker to attach to notifications.
  const broker = getBroker();

  // Create a NotificationManager to handle notifications.
  const manager = new NotificationManager(Context);

  // Get all the notification handlers. Additional plugins registered before
  // this one can expose a `notifications` hook, that contains an array of
  // notification handlers.
  //
  // A notification handler has the following form:
  //
  // {
  //   event     // the graph event to listen for
  //   handle    // the function called when the event is fired. It is called with
  //             // the (ctx, arg1, arg2, ...) where arg1, arg2 are args from the
  //             // event.
  //   category  // the name representing the notification type (like 'reply')
  //   hydrate   // returns the replacement parameters (in order!) to be used
  //             // in the translation.
  // }
  //
  const notificationHandlers = Plugins.get('server', 'notifications').reduce(
    (handlers, { plugin, notifications }) => {
      debug(
        `registered the ${
          plugin.name
        } plugin for notifications ${notifications.map(
          ({ category }) => category
        )}`
      );
      handlers.push(...notifications);
      return handlers;
    },
    []
  );

  // Attach all the notification handlers.
  manager.register(...notificationHandlers);

  // Digest handlers should export the following to the `notificationDigests`
  // plugin hook:
  //
  // {DAILY: { cronTime: '0 0 * * *', timeZone: 'America/New_York' }}
  //
  // Where `DAILY` is the key referenced in the typeDefs as a new type of
  // `DIGEST_FREQUENCY`, and the value of that key is the one provided to the
  // constructor for the Cron object:
  //
  // https://github.com/kelektiv/node-cron
  //
  // Which is used to trigger the digest operation for those uses setup with
  // that type of digesting.
  const digestHandlers = Plugins.get('server', 'notificationDigests').reduce(
    (handlers, { plugin, notificationDigests }) => {
      debug(
        `registered the ${plugin.name} plugin for digest notifications ${map(
          notificationDigests,
          (config, frequency) => frequency
        )}`
      );

      return reduce(
        notificationDigests,
        (handlers, config, frequency) => {
          handlers.push({ config, frequency });

          return handlers;
        },
        handlers
      );
    },
    []
  );

  // Attach all the notification digest handlers.
  manager.registerDigests(...digestHandlers);

  // Attach the broker to the manager so it can listen for the events.
  manager.attach(broker);

  // Start processing digests.
  manager.startDigesting();
};
