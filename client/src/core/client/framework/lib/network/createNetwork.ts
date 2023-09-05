import { FluentBundle } from "@fluent/bundle/compat";
import {
  authMiddleware,
  cacheMiddleware,
  RelayNetworkLayer,
  RelayNetworkLayerResponse,
  RelayRequestAny,
  retryMiddleware,
  urlMiddleware,
} from "react-relay-network-modern/es";
import { GraphQLResponse, Observable, SubscribeFunction } from "relay-runtime";

import { AccessTokenProvider } from "../auth";
import clearHTTPCacheMiddleware from "./clearHTTPCacheMiddleware";
import clientIDMiddleware from "./clientIDMiddleware";
import { ManagedSubscriptionClient } from "./createManagedSubscriptionClient";
import customErrorMiddleware from "./customErrorMiddleware";
import persistedQueriesGetMethodMiddleware from "./persistedQueriesGetMethodMiddleware";

export type TokenRefresh = (
  req: RelayRequestAny,
  res: RelayNetworkLayerResponse
) => string | Promise<string>;

function createSubscriptionFunction(
  subscriptionClient: ManagedSubscriptionClient
): SubscribeFunction {
  const fn: SubscribeFunction = (operation, variables, cacheConfig) => {
    return Observable.create<GraphQLResponse>((sink) => {
      const subscription = subscriptionClient.subscribe(
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

      return () => {
        subscription.dispose();
      };
    });
  };
  return fn;
}

export default function createNetwork(
  graphqlURL: string,
  subscriptionClient: ManagedSubscriptionClient,
  clientID: string,
  accessTokenProvider: AccessTokenProvider,
  localeBundles: FluentBundle[],
  tokenRefresh?: TokenRefresh,
  clearCacheBefore?: Date
) {
  return new RelayNetworkLayer(
    [
      // Send cache clearing headers until `clearCacheBefore` date
      // to invalidate previous http cache. Usually used when the session changes
      // through login or logout.
      clearHTTPCacheMiddleware(clearCacheBefore),
      customErrorMiddleware(localeBundles),
      cacheMiddleware({
        size: 100, // max 100 requests
        ttl: 30 * 1000, // 30 seconds
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
        beforeRetry: ({ abort, attempt, lastError }) => {
          if (attempt > 2) {
            let message = lastError?.message;
            if (message && lastError?.name !== "RRNLRetryMiddlewareError") {
              // Prefix with Error name.
              message = `(${lastError?.name}) ${message}`;
            }
            abort(message);
          }
        },
      }),
      authMiddleware({
        token: () => {
          return accessTokenProvider() || "";
        },
        tokenRefreshPromise: tokenRefresh,
        allowEmptyToken: true,
      }),
      clientIDMiddleware(clientID),
      persistedQueriesGetMethodMiddleware,
    ],
    // TODO: (cvle) Typing mismatch between Relay and react-relay-network-modern.
    { subscribeFn: createSubscriptionFunction(subscriptionClient) as any }
  );
}
