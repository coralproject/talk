import { withMutation } from 'plugin-api/beta/client/hocs';
import { gql } from 'react-apollo';
import update from 'immutability-helper';
import moment from 'moment';

export const withRequestDownloadLink = withMutation(
  gql`
    mutation RequestDownloadLink {
      requestDownloadLink {
        ...RequestDownloadLinkResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      requestDownloadLink: () => {
        return mutate({
          variables: {},
        });
      },
    }),
  }
);

export const withRequestAccountDeletion = withMutation(
  gql`
    mutation RequestAccountDeletion {
      requestAccountDeletion {
        ...RequestAccountDeletionResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      requestAccountDeletion: () => {
        return mutate({
          variables: {},
          update: proxy => {
            const RequestAccountDeletionQuery = gql`
              query Talk_CancelAccountDeletion {
                me {
                  id
                  scheduledDeletionDate
                }
              }
            `;

            const prev = proxy.readQuery({
              query: RequestAccountDeletionQuery,
            });

            const scheduledDeletionDate = moment()
              .add(12, 'hours')
              .toDate();

            const data = update(prev, {
              me: {
                scheduledDeletionDate: { $set: scheduledDeletionDate },
              },
            });

            proxy.writeQuery({
              query: RequestAccountDeletionQuery,
              data,
            });
          },
        });
      },
    }),
  }
);

export const withCancelAccountDeletion = withMutation(
  gql`
    mutation RequestDownloadLink {
      cancelAccountDeletion {
        ...CancelAccountDeletionResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      cancelAccountDeletion: () => {
        return mutate({
          variables: {},
          update: proxy => {
            const CancelAccountDeletionQuery = gql`
              query Talk_CancelAccountDeletion {
                me {
                  id
                  scheduledDeletionDate
                }
              }
            `;

            const prev = proxy.readQuery({ query: CancelAccountDeletionQuery });

            const data = update(prev, {
              me: {
                scheduledDeletionDate: { $set: null },
              },
            });

            proxy.writeQuery({
              query: CancelAccountDeletionQuery,
              data,
            });
          },
        });
      },
    }),
  }
);
