import { gql } from 'react-apollo';

export default {
  mutations: {
    UpdateNotificationSettings: ({
      variables: { input },
      state: { auth: { user: { id } } },
    }) => ({
      update: proxy => {
        if (input.onStaffReply === undefined) {
          return;
        }

        const fragment = gql`
          fragment TalkNotificationsCategoryStaffReply_User_Fragment on User {
            notificationSettings {
              onStaffReply
            }
          }
        `;
        const fragmentId = `User_${id}`;
        const data = {
          __typename: 'User',
          notificationSettings: {
            __typename: 'NotificationSettings',
            onStaffReply: input.onStaffReply,
          },
        };
        proxy.writeFragment({ fragment, id: fragmentId, data });
      },
    }),
  },
};
