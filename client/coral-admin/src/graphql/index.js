export default {
  mutations: {
    SetUserStatus: () => ({
      refetchQueries: ['TalkAdmin_FlaggedAccounts'],
    }),
    RejectUsername: () => ({
      refetchQueries: ['TalkAdmin_FlaggedAccounts'],
    }),
  },
};

