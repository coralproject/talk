import {graphql} from 'react-apollo';

import ASSET_METRICS from './assetMetrics.graphql';
import COMMENT_METRICS from './commentMetrics.graphql';
import MOD_QUEUE_QUERY from './modQueueQuery.graphql';

export const mostFlags = graphql(ASSET_METRICS, {
  options: () => {

    // currently hard-coded per Greg's advice
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    return {
      variables: {
        sort: 'FLAG',
        from: fiveMinutesAgo.toISOString(),
        to: new Date().toISOString()
      }
    };
  }
});

export const mostLikes = graphql(ASSET_METRICS, {
  options: () => {

    // currently hard-coded per Greg's advice
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    return {
      variables: {
        sort: 'LIKE',
        from: fiveMinutesAgo.toISOString(),
        to: new Date().toISOString()
      }
    };
  }
});

export const mostLikedComments = graphql(COMMENT_METRICS, {
  options: () => {

    // currently hard-coded per Greg's advice
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    return {
      variables: {
        sort: 'LIKE',
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
        asset_id: id
      }
    };
  }
});
