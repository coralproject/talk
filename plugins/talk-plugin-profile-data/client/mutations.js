import { withMutation } from 'plugin-api/beta/client/hocs';
import { gql } from 'react-apollo';

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
