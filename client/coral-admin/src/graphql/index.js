export default {
  mutations: {
    SetUserStatus: () => ({
      refetchQueries: ['CoralAdmin_Community'],
    }),
    RejectUsername: () => ({
      refetchQueries: ['CoralAdmin_Community'],
    }),
  },
};

