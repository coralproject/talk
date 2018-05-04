import { gql } from 'react-apollo';
import update from 'immutability-helper';
import withMutation from 'coral-framework/hocs/withMutation';

export const withUpdateEmailAddress = withMutation(
  gql`
    mutation UpdateEmailAddress($input: UpdateEmailAddressInput!) {
      updateEmailAddress(input: $input) {
        ...UpdateEmailAddressResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      updateEmailAddress: input => {
        return mutate({
          variables: {
            input,
          },
          update: proxy => {
            const UpdateEmailAddressQuery = gql`
              query Talk_UpdateEmailAddress {
                me {
                  id
                  email
                }
              }
            `;

            const prev = proxy.readQuery({ query: UpdateEmailAddressQuery });

            const data = update(prev, {
              me: {
                email: { $set: input.email },
              },
            });

            proxy.writeQuery({
              query: UpdateEmailAddressQuery,
              data,
            });
          },
        });
      },
    }),
  }
);
