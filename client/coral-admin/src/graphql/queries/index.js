import {graphql} from 'react-apollo';
import MOD_QUEUE_QUERY from './modQueueQuery.graphql';

export const modQueueQuery = graphql(MOD_QUEUE_QUERY, {
  options: () => ({
    variables: {
      asset_url: 'id'
    }
  })
});
