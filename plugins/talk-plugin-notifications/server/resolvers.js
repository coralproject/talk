const { get } = require('lodash');

module.exports = {
  User: {
    notificationSettings(user, args, { user: currentUser }) {
      if (
        currentUser &&
        (currentUser.id === user.id || currentUser.can('VIEW_USER_STATUS'))
      ) {
        return get(user, 'metadata.notifications.settings');
      }
    },
  },
};
