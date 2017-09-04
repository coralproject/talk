import IgnoreUserAction from './containers/IgnoreUserAction';
import IgnoreUserConfirmation from './containers/IgnoreUserConfirmation';
import translations from './translations.yml';
import update from 'immutability-helper';

export default {
  mutations: {
    IgnoreUser: ({variables}) => ({
      updateQueries: {
        CoralEmbedStream_Embed: (previousData) => {
          const ignoredUserId = variables.id;
          const updated = update(previousData, {me: {ignoredUsers: {$push: [{
            id: ignoredUserId,
            __typename: 'User',
          }]}}});
          return updated;
        }
      }
    }),
  },
  slots: {
    authorMenuActions: [IgnoreUserAction],
    ignoreUserConfirmation: [IgnoreUserConfirmation]
  },
  translations
};
