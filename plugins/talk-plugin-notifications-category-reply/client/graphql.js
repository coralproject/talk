import { gql } from 'react-apollo';

export default {
  mutations: {
    UpdateNotificationSettings: ({
      variables: { input },
      state: { auth: { user: { id } } },
    }) => ({
      update: proxy => {
        if (input.onReply === undefined) {
          return;
        }

        const fragment = gql`
          fragment TalkNotificationsCategoryReply_User_Fragment on User {
            notificationSettings {
              onReply
            }
          }
        `;
        const fragmentId = `User_${id}`;
        const data = {
          __typename: 'User',
          notificationSettings: {
            __typename: 'NotificationSettings',
            onReply: input.onReply,
          },
        };
        proxy.writeFragment({ fragment, id: fragmentId, data });
      },
    }),
  },
};
