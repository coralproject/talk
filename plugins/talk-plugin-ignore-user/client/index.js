import IgnoreUserAction from './containers/IgnoreUserAction';
import IgnoreUserConfirmation from './containers/IgnoreUserConfirmation';
import IgnoredUserSection from './containers/IgnoredUserSection';
import translations from './translations.yml';
import update from 'immutability-helper';

export default {
  slots: {
    authorMenuActions: [IgnoreUserAction],
    ignoreUserConfirmation: [IgnoreUserConfirmation],
    profileSettings: [IgnoredUserSection],
  },
  translations,
  mutations: {
    IgnoreUser: ({ variables }) => ({
      updateQueries: {
        CoralEmbedStream_Embed: previousData => {
          const ignoredUserId = variables.id;
          const updated = update(previousData, {
            me: {
              ignoredUsers: {
                $push: [
                  {
                    id: ignoredUserId,
                    __typename: 'User',
                  },
                ],
              },
            },
          });
          return updated;
        },
      },
    }),
    StopIgnoringUser: ({ variables }) => ({
      updateQueries: {
        CoralEmbedStream_Profile: previousData => {
          const noLongerIgnoredUserId = variables.id;

          // remove noLongerIgnoredUserId from ignoredUsers
          const updated = update(previousData, {
            me: {
              ignoredUsers: {
                $apply: ignoredUsers => {
                  return ignoredUsers.filter(
                    u => u.id !== noLongerIgnoredUserId
                  );
                },
              },
            },
          });
          return updated;
        },
      },
    }),
  },
};
