import { withMutation } from 'plugin-api/beta/client/hocs';
import { gql } from 'react-apollo';

export const withUpdateNotificationSettings = withMutation(
  gql`
    mutation UpdateNotificationSettings($input: NotificationSettingsInput!) {
      updateNotificationSettings(input: $input) {
        ...UpdateNotificationSettingsResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      updateNotificationSettings: input => {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }
);
