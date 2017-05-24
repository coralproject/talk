import {gql} from 'react-apollo';
import {add} from 'coral-framework/services/graphqlRegistry';

const extension = {
  fragments: {
    Metrics: gql`
      fragment CoralAdmin_Metrics on Asset {
        id
        title
        url
        author
        created_at
        commentCount
        action_summaries {
          actionCount
          actionableItemCount
        }
      }
    `,
  },
};

add(extension);
