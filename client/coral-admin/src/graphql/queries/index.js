import {graphql} from 'react-apollo';

import MOST_FLAGS from './mostFlags.graphql';
import MOD_QUEUE_QUERY from './modQueueQuery.graphql';

export const mostFlags = graphql(MOST_FLAGS, {});

export const modQueueQuery = graphql(MOD_QUEUE_QUERY, {
  options: ({params: {id = ''}}) => {
    return {
      variables: {
        asset_id: id
      }
    };
  }
});
