const { get } = require('lodash');
const { DISABLE_REQUIRE_EMAIL_VERIFICATIONS } = require('./config');

module.exports = {
  User: {
    notificationSettings(user, args, { user: currentUser }) {
      if (
        currentUser &&
        (currentUser.id === user.id || currentUser.can('VIEW_USER_STATUS'))
      ) {
        return get(user, 'metadata.notifications.settings', {});
      }
    },
  },
  NotificationSettings: {
    digestFrequency: settings => get(settings, 'digestFrequency', 'NONE'),
  },
  RootMutation: {
    async updateNotificationSettings(
      obj,
      { input },
      {
        mutators: { User },
      }
    ) {
      await User.updateNotificationSettings(input);
    },
  },
  Settings: {
    notificationsRequireConfirmation: () =>
      Boolean(!DISABLE_REQUIRE_EMAIL_VERIFICATIONS),
  },
};
