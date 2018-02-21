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
    UpdateNotificationSettings: () => ({
      optimisticResponse: {
        updateNotificationSettings: {
          __typename: 'UpdateNotificationSettingsResponse',
          errors: null,
        },
      },
    }),
  },
};
