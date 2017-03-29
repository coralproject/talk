import ApolloClient, {addTypename} from 'apollo-client';
import getNetworkInterface from './transport';

import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';
const wsClient = new SubscriptionClient('ws://localhost:3000/api/v1/live', {
  reconnect: true
});
const networkInterface = getNetworkInterface();
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

export const client = new ApolloClient({
  connectToDevTools: true,
  queryTransformer: addTypename,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
      return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
    }
    return null;
  },
  networkInterface: networkInterfaceWithSubscriptions,
});
