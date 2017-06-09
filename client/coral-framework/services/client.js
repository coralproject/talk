import ApolloClient, {addTypename} from 'apollo-client';
import {networkInterface} from './transport';
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';
import {SUBSCRIPTION_END} from 'subscriptions-transport-ws/dist/messageTypes';
import {getAuthToken} from '../helpers/request';

let client, wsClient = null, wsClientToken = null;

export function resetWebsocket() {
  if (wsClient === null) {

    // Nothing to reset!
    return;
  }

  // Unsubscribe from all the active subscriptions.
  Object.keys(wsClient.subscriptions).forEach((id) => {

    // Create the message.
    let message = {id: parseInt(id), type: SUBSCRIPTION_END};

    // Send the unsubscribe message.
    wsClient.client.send(JSON.stringify(message));
  });

  // Close the client, this will trigger a reconnect.
  wsClient.close();
}

export function getClient() {
  if (client) {
    return client;
  }

  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  wsClient = new SubscriptionClient(`${protocol}://${location.host}/api/v1/live`, {
    reconnect: true,
    connectionParams: {
      get token() {

        wsClientToken = getAuthToken();

        // Try to get the token from localStorage. If it isn't here, it may
        // be passed as a cookie.

        // NOTE: THIS IS ONLY EVER EVALUATED ONCE, IN ORDER TO SEND A DIFFERNT
        // TOKEN YOU MUST DISCONNECT AND RECONNECT THE WEBSOCKET CLIENT.
        return wsClientToken;
      }
    }
  });

  const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient,
  );

  client = new ApolloClient({
    connectToDevTools: true,
    addTypename: true,
    queryTransformer: addTypename,
    dataIdFromObject: (result) => {
      if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
        return `${result.__typename}_${result.id}`; // eslint-disable-line no-underscore-dangle
      }
      return null;
    },
    networkInterface: networkInterfaceWithSubscriptions,
  });

  return client;
}
