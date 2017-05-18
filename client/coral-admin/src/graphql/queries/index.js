import {graphql} from 'react-apollo';

import MOD_QUEUE_QUERY from './modQueueQuery.graphql';
import MOD_QUEUE_LOAD_MORE from './loadMore.graphql';
import MOD_USER_FLAGGED_QUERY from './modUserFlaggedQuery.graphql';
import METRICS from './metricsQuery.graphql';
import USER_DETAIL from './userDetail.graphql';
import GET_QUEUE_COUNTS from './getQueueCounts.graphql';

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
    modQueueResort: modQueueResort(id, data.fetchMore),
    loadMore: loadMore(data.fetchMore)
  })
});

export const getMetrics = graphql(METRICS, {
  options: ({settings: {dashboardWindowStart, dashboardWindowEnd}}) => {

    return {
      variables: {
        from: dashboardWindowStart,
        to: dashboardWindowEnd
      }
    };
  }
});

export const loadMore = (fetchMore) => ({limit = 10, cursor, sort, tab, asset_id}) => {
  let variables = {
    limit,
    cursor,
    sort,
    asset_id
  };
  switch(tab) {
  case 'all':
    variables.statuses = null;
    break;
  case 'accepted':
    variables.statuses = ['ACCEPTED'];
    break;
  case 'premod':
    variables.statuses = ['PREMOD'];
    break;
  case 'flagged':
    variables.statuses = ['NONE', 'PREMOD'];
    variables.action_type = 'FLAG';
    break;
  case 'rejected':
    variables.statuses = ['REJECTED'];
    break;
  }
  return fetchMore({
    query: MOD_QUEUE_LOAD_MORE,
    variables,
    updateQuery: (oldData, {fetchMoreResult:{comments}}) => {
      return {
        ...oldData,
        [tab]: [
          ...oldData[tab],
          ...comments
        ]
      };
    }
  });
};

export const modUserFlaggedQuery  = graphql(MOD_USER_FLAGGED_QUERY, {
  options: ({params: {action_type = 'FLAG'}}) => {
    return {
      variables: {
        action_type: action_type
      }
    };
  }
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

export const getUserDetail = graphql(USER_DETAIL, {
  options: ({id}) => {
    return {
      variables: {author_id: id}
    };
  }
});

export const getQueueCounts = graphql(GET_QUEUE_COUNTS, {
  options: ({params: {id = null}}) => {
    return {
      pollInterval: 5000,
      variables: {
        asset_id: id
      }
    };
  }
});
