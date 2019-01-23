import { gql } from 'react-apollo';

export default {
  fragments: {
    UpdateNotificationSettingsResponse: gql`
      fragment Talk_UpdateNotificationSettingsResponse on UpdateNotificationSettingsResponse {
        errors {
          translation_key
        }
      }
    `,
  },
  mutations: {
    UpdateNotificationSettings: ({
      variables: { input },
      state: {
        auth: {
          user: { id },
        },
      },
    }) => ({
      optimisticResponse: {
        updateNotificationSettings: {
          __typename: 'UpdateNotificationSettingsResponse',
          errors: null,
        },
      },
      update: proxy => {
        if (input.digestFrequency === undefined) {
          return;
        }

        const fragment = gql`
          fragment TalkNotificationsCategoryReply_User_Fragment on User {
            notificationSettings {
              digestFrequency
            }
          }
        `;
        const fragmentId = `User_${id}`;
        const data = {
          __typename: 'User',
          notificationSettings: {
            __typename: 'NotificationSettings',
            digestFrequency: input.digestFrequency,
          },
        };
        proxy.writeFragment({ fragment, id: fragmentId, data });
      },
    }),
  },
};
