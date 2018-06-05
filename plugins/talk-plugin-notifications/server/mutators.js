const { reduce, isNull, isEmpty } = require('lodash');

/**
 * Reduce the settings to dotize the settings.
 */
function reduceSettings(newSettings, newValue, key) {
  if (!isNull(newValue)) {
    newSettings[`metadata.notifications.settings.${key}`] = newValue;
  }

  return newSettings;
}

/**
 * Update the user notification settings.
 */
async function updateNotificationSettings(ctx, settings) {
  const {
    connectors: {
      models: { User },
    },
    user,
  } = ctx;

  // Generate the settings set object, and just exit if we haven't changed
  // anything.
  const $set = reduce(settings, reduceSettings, {});
  if (isEmpty($set)) {
    return;
  }

  // Update the user.
  return User.updateOne({ id: user.id }, { $set });
}

module.exports = ctx => {
  const {
    connectors: { errors: ErrNotAuthorized },
  } = ctx;

  let mutators = {
    User: {
      updateNotificationSettings: () => Promise.reject(new ErrNotAuthorized()),
    },
  };

  if (ctx.user) {
    // TODO: check to see if the user is verified?
    mutators.User.updateNotificationSettings = settings =>
      updateNotificationSettings(ctx, settings);
  }

  return mutators;
};
