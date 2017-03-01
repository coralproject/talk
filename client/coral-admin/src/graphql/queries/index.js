import {graphql} from 'react-apollo';

import MOST_FLAGS from './mostFlags.graphql';
import MOD_QUEUE_QUERY from './modQueueQuery.graphql';
import MOD_USER_FLAGGED_QUERY from './modUserFlaggedQuery.graphql';

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
        asset_id: id
      }
    };
  }
});

export const modUserFlaggedQuery  = graphql(MOD_USER_FLAGGED_QUERY);
