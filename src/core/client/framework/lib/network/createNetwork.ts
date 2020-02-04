import {
  authMiddleware,
  cacheMiddleware,
  RelayNetworkLayer,
  retryMiddleware,
  SubscribeFunction,
  urlMiddleware,
} from "react-relay-network-modern/es";

import TIME from "coral-common/time";
import getLocationOrigin from "coral-framework/utils/getLocationOrigin";

import clientIDMiddleware from "./clientIDMiddleware";
import { ManagedSubscriptionClient } from "./createManagedSubscriptionClient";
import customErrorMiddleware from "./customErrorMiddleware";
import persistedQueriesGetMethodMiddleware from "./persistedQueriesGetMethodMiddleware";

export type TokenGetter = () => string;

const graphqlURL = `${getLocationOrigin()}/api/graphql`;

function createSubscriptionFunction(
  subscriptionClient: ManagedSubscriptionClient
): SubscribeFunction {
  const fn: SubscribeFunction = (
    operation,
    variables,
    cacheConfig,
    observer
  ) => {
    return subscriptionClient.subscribe(
      operation,
      variables,
      cacheConfig,
      observer
    );
  };
  return fn;
}

export default function createNetwork(
  subscriptionClient: ManagedSubscriptionClient,
  tokenGetter: TokenGetter,
  clientID: string
) {
  return new RelayNetworkLayer(
    [
      customErrorMiddleware,
      cacheMiddleware({
        size: 100, // max 100 requests
        ttl: 15 * TIME.MINUTE,
        clearOnMutation: true,
      }),
      urlMiddleware({
        url: () => Promise.resolve(graphqlURL),
      }),
      retryMiddleware({
        fetchTimeout: 15000,
        retryDelays: (attempt: number) => Math.pow(2, attempt + 4) * 100,
        // or simple array [3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600],
        statusCodes: [500, 503, 504],
        beforeRetry: ({ abort, attempt }) => {
          if (attempt > 2) {
            abort();
          }
        },
      }),
      authMiddleware({
        token: tokenGetter,
      }),
      clientIDMiddleware(clientID),
      persistedQueriesGetMethodMiddleware,
    ],
    { subscribeFn: createSubscriptionFunction(subscriptionClient) }
  );
}
