import {graphql} from 'react-apollo';
import MOD_QUEUE_QUERY from './modQueueQuery.graphql';

export const modQueueQuery = graphql(MOD_QUEUE_QUERY, {
  options: ({params: {id = ''}}) => {
    return {
      variables: {
        asset_id: id
      }
    };
  }
});
