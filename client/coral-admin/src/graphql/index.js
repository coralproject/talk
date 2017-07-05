import {add} from 'coral-framework/services/graphqlRegistry';

const extension = {
  mutations: {
    SetUserStatus: () => ({
      refetchQueries: ['CoralAdmin_Community'],
    }),
    RejectUsername: () => ({
      refetchQueries: ['CoralAdmin_Community'],
    }),
  },
};

add(extension);
