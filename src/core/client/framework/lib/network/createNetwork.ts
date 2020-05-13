import {
  authMiddleware,
  cacheMiddleware,
  RelayNetworkLayer,
  retryMiddleware,
  urlMiddleware,
} from "react-relay-network-modern/es";
import { GraphQLResponse, Observable, SubscribeFunction } from "relay-runtime";

import TIME from "coral-common/time";
import getLocationOrigin from "coral-framework/utils/getLocationOrigin";

import { AccessTokenProvider } from "../auth";
import clientIDMiddleware from "./clientIDMiddleware";
import { ManagedSubscriptionClient } from "./createManagedSubscriptionClient";
import customErrorMiddleware from "./customErrorMiddleware";
import persistedQueriesGetMethodMiddleware from "./persistedQueriesGetMethodMiddleware";

const graphqlURL = `${getLocationOrigin()}/api/graphql`;

function createSubscriptionFunction(
  subscriptionClient: ManagedSubscriptionClient
): SubscribeFunction {
  const fn: SubscribeFunction = (operation, variables, cacheConfig) => {
    return Observable.create<GraphQLResponse>((sink) => {
      subscriptionClient.subscribe(
        operation as any,
        variables,
        {
          force: cacheConfig.force === null ? undefined : cacheConfig.force,
          poll: cacheConfig.poll === null ? undefined : cacheConfig.poll,
        },
        {
          onNext: sink.next,
          onError: sink.error,
          onCompleted: sink.complete,
        }
      );
    });
  };
  return fn;
}

export default function createNetwork(
  subscriptionClient: ManagedSubscriptionClient,
  clientID: string,
  accessTokenProvider: AccessTokenProvider
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
        token: () => {
          return accessTokenProvider() || "";
        },
      }),
      clientIDMiddleware(clientID),
      persistedQueriesGetMethodMiddleware,
    ],
    // TODO: (cvle) Typing mismatch between Relay and react-relay-network-modern.
    { subscribeFn: createSubscriptionFunction(subscriptionClient) as any }
  );
}
