const { get } = require('lodash');

module.exports = {
  RootMutation: {
    requestDownloadLink: async (_, args, { mutators: { User } }) => {
      await User.requestDownloadLink();
    },
    downloadUser: async (_, { id }, { mutators: { User } }) => ({
      archiveURL: await User.download(id),
    }),
  },
  User: {
    lastAccountDownload: (user, args, { user: currentUser }) => {
      // If the current user is not the requesting user, and the user is not
      // an admin, return nothing.
      if (user.id !== currentUser.id && user.role !== 'ADMIN') {
        return null;
      }

      return get(user, 'metadata.lastAccountDownload', null);
    },
  },
};
