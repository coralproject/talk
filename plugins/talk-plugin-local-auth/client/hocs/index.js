import { withMutation } from 'plugin-api/beta/client/hocs';
import { gql } from 'react-apollo';
import update from 'immutability-helper';

export const withAttachLocalAuth = withMutation(
  gql`
    mutation AttachLocalAuth($input: AttachLocalAuthInput!) {
      attachLocalAuth(input: $input) {
        ...AttachLocalAuthResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      attachLocalAuth: input => {
        return mutate({
          variables: {
            input,
          },
          update: proxy => {
            const AttachLocalAuthQuery = gql`
              query Talk_AttachLocalAuth {
                me {
                  id
                  email
                }
              }
            `;

            const prev = proxy.readQuery({ query: AttachLocalAuthQuery });

            const data = update(prev, {
              me: {
                email: { $set: input.email },
              },
            });

            proxy.writeQuery({
              query: AttachLocalAuthQuery,
              data,
            });
          },
        });
      },
    }),
  }
);

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
