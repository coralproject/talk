import { withMutation } from 'plugin-api/beta/client/hocs';
import { gql } from 'react-apollo';
import moment from 'moment';
import update from 'immutability-helper';

import { scheduledDeletionDelayHours } from '../../config';

export const withRequestDownloadLink = withMutation(
  gql`
    mutation DownloadCommentHistory {
      requestDownloadLink {
        errors {
          translation_key
        }
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      requestDownloadLink: () => mutate({ variables: {} }),
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
              .add(scheduledDeletionDelayHours, 'hours')
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
