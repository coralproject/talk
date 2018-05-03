import update from 'immutability-helper';
import get from 'lodash/get';

export default {
  mutations: {
    UpdateEmailAddress: () => ({
      updateQueries: {
        CoralEmbedStream_Profile: previousData => {
          // Find the local profile (if they have one).
          const localIndex = get(previousData, 'me.profiles', []).indexOf(
            ({ provider }) => provider === 'local'
          );
          if (localIndex < 0) {
            return previousData;
          }

          // Mutate the confirmedAt, because we changed the email address, they
          // can't possibly be confirmed now as well.
          return update(previousData, {
            me: {
              profiles: {
                [localIndex]: {
                  confirmedAt: {
                    $set: null,
                  },
                },
              },
            },
          });
        },
      },
    }),
  },
};
