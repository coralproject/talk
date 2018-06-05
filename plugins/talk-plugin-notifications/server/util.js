const getOrganizationName = async ctx => {
  // Grab some useful tools.
  const {
    loaders: { Settings },
  } = ctx;

  // Get the settings.
  const { organizationName = null } = await Settings.select('organizationName');

  return organizationName;
};

/**
 * getNotificationBody will return the body for the notification payload.
 *
 * @param {Object} ctx the graph context
 * @param {Object} handler the notification handler
 * @param {Mixed} context the notification context
 */
const getNotificationBody = async (ctx, handler, context) => {
  const {
    connectors: {
      services: {
        I18n: { t },
      },
    },
  } = ctx;
  const { category, hydrate = () => [] } = handler;

  // Get the body replacement variables for the translation key.
  const replacements = await hydrate(ctx, category, context);

  // Generate the body.
  return t(
    `talk-plugin-notifications.categories.${category}.body`,
    ...replacements
  );
};

module.exports = { getNotificationBody, getOrganizationName };
