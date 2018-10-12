import ApolloClient, {
  IntrospectionFragmentMatcher,
  createNetworkInterface,
} from 'apollo-client';
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';

// Redux middleware to report any errors to the console.
export const apolloErrorReporter = () => next => action => {
  if (action.type === 'APOLLO_QUERY_ERROR') {
    console.error(action.error);
  }
  return next(action);
};

function resolveToken(token) {
  return typeof token === 'function' ? token() : token;
}

/**
 * createClient setups and returns an Apollo GraphQL Client
 * @param  {Object}          [options]          configuration
 * @param  {string|function} [options.token]    auth token
 * @param  {string}          [options.uri]      uri of the graphql server
 * @param  {string}          [options.liveUri]  uri of the graphql subscription server
 * @param  {Object}          [options.introspectionData] introspection query result data
 * @return {Object}          apollo client
 */
export function createClient(options = {}) {
  const { token, uri, liveUri, introspectionData } = options;
  const wsClient = new SubscriptionClient(liveUri, {
    reconnect: true,
    lazy: true,
    connectionParams: {
      get token() {
        return resolveToken(token);
      },
    },
  });

  const networkInterface = createNetworkInterface({
    uri,
    opts: {
      credentials: 'same-origin',
    },
  });

  networkInterface.use([
    {
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {}; // Create the header object if needed.
        }

        let authToken = resolveToken(token);
        if (authToken) {
          req.options.headers['authorization'] = `Bearer ${authToken}`;
        }
        // To debug queries add print(req.request.query) and import it from graphql/language/printer
        // console.log(print(req.request.query));
        next();
      },
    },
  ]);

  const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
  );

  const client = new ApolloClient({
    connectToDevTools: true,
    addTypename: true,
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: introspectionData,
    }),
    dataIdFromObject: result => {
      if (result.id && result.__typename) {
        // eslint-disable-line no-underscore-dangle
        return `${result.__typename}_${result.id}`; // eslint-disable-line no-underscore-dangle
      }
      return null;
    },
    networkInterface: networkInterfaceWithSubscriptions,
  });

  client.resetWebsocket = () => {
    if (wsClient.client) {
      // Close socket connection which will also unregister subscriptions on the server-side.
      wsClient.close(true);

      // Reconnect to the server.
      wsClient.connect();

      // Re-register all subscriptions (uses non public api).
      // See: https://github.com/apollographql/subscriptions-transport-ws/issues/171
      Object.keys(wsClient.operations).forEach(id => {
        wsClient.sendMessage(
          id,
          MessageTypes.GQL_START,
          wsClient.operations[id].options
        );
      });
    }
  };

  return client;
}
