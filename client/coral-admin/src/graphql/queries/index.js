import {graphql} from 'react-apollo';

import MOD_QUEUE_QUERY from './modQueueQuery.graphql';

export const modQueueQuery = graphql(MOD_QUEUE_QUERY, {
  options: ({params: {id = null}}) => {
    return {
      variables: {
        asset_id: id,
        sort: 'REVERSE_CHRONOLOGICAL'
      }
    };
  },
  props: ({ownProps: {params: {id = null}}, data}) => ({
    data,
    modQueueResort: modQueueResort(id, data.fetchMore)
  })
});

export const modQueueResort = (id, fetchMore) => (sort) => {
  return fetchMore({
    query: MOD_QUEUE_QUERY,
    variables: {
      asset_id: id,
      sort
    },
    updateQuery: (oldData, {fetchMoreResult:{data}}) => data
  });
};
