const UserProfile = {
  __resolveType({ provider }) {
    switch (provider) {
      case 'local':
        return 'LocalUserProfile';
      default:
        return undefined;
    }
  },
};

module.exports = UserProfile;
