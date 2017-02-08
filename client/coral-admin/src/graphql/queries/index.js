import {graphql} from 'react-apollo';
import MOD_QUEUE_QUERY from './modQueueQuery.graphql';

export const modQueueQuery = graphql(MOD_QUEUE_QUERY, {
  options: () => ({
    variables: {
      asset_id: 'bae04102-33b5-4f43-b827-45d9ba9f2b37'
    }
  })
});
