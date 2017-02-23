import {graphql} from 'react-apollo';

import METRICS from './metrics.graphql';
import MOD_QUEUE_QUERY from './modQueueQuery.graphql';

// export const getMetrics = graphql(METRICS, {
//   options: () => {
//
//     // currently hard-coded per Greg's advice
//     const fiveMinutesAgo = new Date();
//     fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
//     return {
//       variables: {
//         // from: fiveMinutesAgo.toISOString(),
//         from: '2017-02-23T16:09:44.235Z',
//         // to: new Date().toISOString()
//         to: '2017-02-23T19:30:23.251Z'
//       }
//     };
//   }
// });

export const modQueueQuery = graphql(MOD_QUEUE_QUERY, {
  options: ({params: {id = null}}) => {
    return {
      variables: {
        asset_id: id
      }
    };
  }
});
