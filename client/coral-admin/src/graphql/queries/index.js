import {graphql} from 'react-apollo';

import MOST_FLAGS from './mostFlags.graphql';
import MOD_QUEUE_QUERY from './modQueueQuery.graphql';

export const mostFlags = graphql(MOST_FLAGS, {
  options: () => {

    // currently hard-coded per Greg's advice
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 305);
    return {
      variables: {
        sort: 'FLAG',
        from: fiveMinutesAgo.toISOString(),
        to: new Date().toISOString()
      }
    };
  }
});

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
