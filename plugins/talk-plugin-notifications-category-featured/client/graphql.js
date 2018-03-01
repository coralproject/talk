import { gql } from 'react-apollo';

export default {
  mutations: {
    UpdateNotificationSettings: ({
      variables: { input },
      state: { auth: { user: { id } } },
    }) => ({
      update: proxy => {
        if (input.onFeatured === undefined) {
          return;
        }

        const fragment = gql`
          fragment TalkNotificationsCategoryFeatured_User_Fragment on User {
            notificationSettings {
              onFeatured
            }
          }
        `;
        const fragmentId = `User_${id}`;
        const data = {
          __typename: 'User',
          notificationSettings: {
            __typename: 'NotificationSettings',
            onFeatured: input.onFeatured,
          },
        };
        proxy.writeFragment({ fragment, id: fragmentId, data });
      },
    }),
  },
};
