import ApolloClient, {addTypename, IntrospectionFragmentMatcher, createNetworkInterface} from 'apollo-client';
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';
import introspectionQueryResultData from '../graphql/introspection.json';

// Redux middleware to report any errors to the console.
export const apolloErrorReporter = () => (next) => (action) => {
  if (action.type === 'APOLLO_QUERY_ERROR') {
    console.error(action.error);
  }
  return next(action);
};

function resolveToken(token) {
  return typeof token === 'function' ? token() : token;
}

export function createClient(options = {}) {
  const {token, uri, liveUri, ...apolloOptions} = options;
  const wsClient = new SubscriptionClient(liveUri, {
    reconnect: true,
    lazy: true,
    connectionParams: {
      get token() { return resolveToken(token); },
    }
  });

  const networkInterface = createNetworkInterface({
    uri,
    opts: {
      credentials: 'same-origin'
    }
  });

  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }

      let authToken = resolveToken(token);
      if (authToken) {
        req.options.headers['authorization'] = `Bearer ${authToken}`;
      }

      next();
    }
  }]);

  const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient,
  );

  const client = new ApolloClient({
    ...apolloOptions,
    connectToDevTools: true,
    addTypename: true,
    fragmentMatcher: new IntrospectionFragmentMatcher({introspectionQueryResultData}),
    queryTransformer: addTypename,
    dataIdFromObject: (result) => {
      if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
        return `${result.__typename}_${result.id}`; // eslint-disable-line no-underscore-dangle
      }
      return null;
    },
    networkInterface: networkInterfaceWithSubscriptions,
  });

  client.resetWebsocket = () => {

    // Close socket connection which will also unregister subscriptions on the server-side.
    wsClient.close();

    // Reconnect to the server.
    wsClient.connect();

    // Reregister all subscriptions (uses non public api).
    // See: https://github.com/apollographql/subscriptions-transport-ws/issues/171
    Object.keys(wsClient.operations).forEach((id) => {
      wsClient.sendMessage(id, MessageTypes.GQL_START, wsClient.operations[id].options);
    });
  };

  return client;
}
