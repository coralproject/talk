module.exports = {
  RootMutation: {
    updateEmailAddress: async (root, { input }, { mutators: { User } }) => {
      await User.updateEmailAddress(input);
    },
    attachLocalAuth: async (root, { input }, { mutators: { User } }) => {
      await User.attachLocalAuth(input);
    },
  },
};
