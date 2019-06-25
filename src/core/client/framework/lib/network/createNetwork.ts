import {
  authMiddleware,
  batchMiddleware,
  cacheMiddleware,
  RelayNetworkLayer,
  retryMiddleware,
  SubscribeFunction,
  urlMiddleware,
} from "react-relay-network-modern/es";

import clientIDMiddleware from "./clientIDMiddleware";
import { ManagedSubscriptionClient } from "./createManagedSubscriptionClient";
import customErrorMiddleware from "./customErrorMiddleware";

export type TokenGetter = () => string;

const graphqlURL = "/api/graphql";

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
        ttl: 900000, // 15 minutes
        clearOnMutation: true,
      }),
      urlMiddleware({
        url: () => Promise.resolve(graphqlURL),
      }),
      batchMiddleware({
        batchUrl: (requestMap: any) => Promise.resolve(graphqlURL),
        batchTimeout: 0,
        allowMutations: true,
      }),
      retryMiddleware({
        fetchTimeout: 15000,
        retryDelays: (attempt: number) => Math.pow(2, attempt + 4) * 100,
        // or simple array [3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600],
        statusCodes: [500, 503, 504],
      }),
      authMiddleware({
        token: tokenGetter,
      }),
      clientIDMiddleware(clientID),
    ],
    { subscribeFn: createSubscriptionFunction(subscriptionClient) }
  );
}
