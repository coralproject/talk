import {graphql} from 'react-apollo';

import BY_LIKES from './assetsByLike.graphql';
import BY_FLAGS from './assetsByFlag.graphql';
import MOD_QUEUE_QUERY from './modQueueQuery.graphql';

export const mostFlags = graphql(BY_FLAGS, {
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

export const mostLikes = graphql(BY_LIKES, {
  options: () => {
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
