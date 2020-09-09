import { noop } from "lodash";
import ReactDOM from "react-dom";
import {
  CacheConfig,
  ConcreteBatch,
  Disposable,
  Variables,
} from "react-relay-network-modern/es";
import {
  OperationOptions,
  SubscriptionClient,
} from "subscriptions-transport-ws";

import {
  ACCESS_TOKEN_PARAM,
  BUNDLE_CONFIG_PARAM,
  BUNDLE_ID_PARAM,
  CLIENT_ID_PARAM,
} from "coral-common/constants";
import { ERROR_CODES } from "coral-common/errors";

/**
 * SubscriptionRequest contains the subscription
 * request data that comes from Relay.
 */
export interface SubscriptionRequest {
  operation: ConcreteBatch;
  variables: Variables;
  cacheConfig: CacheConfig;
  observer: any;
  /** batch contains response data waiting to be processed */
  batch: any[];
  subscribe: () => void;
  unsubscribe: (() => void) | null;
}

/**
 * ManagedSubscriptionClient builds on top of `SubscriptionClient`
 * and manages the websocket connection economically. A connection is
 * only establish when there is at least 1 active subscription and closes
 * when there is no more active subscriptions.
 */
export interface ManagedSubscriptionClient {
  /**
   * Subscribe to a GraphQL subscription, this is usually called from
   * the SubscriptionFunction provided to Relay.
   */
  subscribe(
    operation: ConcreteBatch,
    variables: Variables,
    cacheConfig: CacheConfig,
    observer: any
  ): Disposable;

  /** Pauses all active subscriptions causing websocket connection to close. */
  pause(): void;

  /** Resume all subscriptions eventually causing websocket to start with new connection parameters */
  resume(): void;

  /** Sets access token and restarts the websocket connection */
  setAccessToken(accessToken?: string): void;
}

/**
 * Batch react state updates.
 */
function reactBatchUpdates(callback: () => void) {
  // Note: 2017 the React team suggested to use this unstable function
  // until React always batches state updates per default.
  ReactDOM.unstable_batchedUpdates(callback);
}

/**
 * Handle all batched response data of given request.
 */
function runBatch(request: SubscriptionRequest) {
  request.batch.forEach((data) => {
    request.observer.onNext({ data });
  });
  request.batch = [];
}

/**
 * Handle batched response data of given requests in a loop.
 */
function batchLoop(requests: SubscriptionRequest[], timeout: number) {
  setTimeout(() => {
    reactBatchUpdates(() => {
      requests.forEach((r) => {
        runBatch(r);
      });
    });
    batchLoop(requests, timeout);
  }, timeout);
}

/**
 * Creates a ManagedSubscriptionClient
 *
 * @param url url of the graphql live server
 * @param clientID a clientID that is provided to the graphql live server
 */
export default function createManagedSubscriptionClient(
  url: string,
  clientID: string,
  bundle: string,
  bundleConfig: Record<string, string>
): ManagedSubscriptionClient {
  const requests: SubscriptionRequest[] = [];
  let subscriptionClient: SubscriptionClient | null = null;
  let paused = false;
  let accessToken: string | undefined;

  // Start batching loop that runs every second.
  batchLoop(requests, 1000);

  const closeClient = () => {
    if (subscriptionClient) {
      subscriptionClient.close();
      // Stop current retry attempt.
      // TODO: (cvle) This relies on internals.
      (subscriptionClient as any).clearMaxConnectTimeout();
      (subscriptionClient as any).clearTryReconnectTimeout();
      subscriptionClient = null;
    }
  };

  const subscribe = (
    operation: ConcreteBatch,
    variables: Variables,
    cacheConfig: CacheConfig,
    observer: any
  ) => {
    // Capture request into an `SubscriptionRequest` object.
    const request: SubscriptionRequest = {
      operation,
      variables,
      cacheConfig,
      observer,
      batch: [],
      unsubscribe: null,
      // We will this function below.
      subscribe: noop,
    };

    request.subscribe = () => {
      if (!subscriptionClient) {
        subscriptionClient = new SubscriptionClient(url, {
          reconnect: true,
          timeout: 60000,
          connectionCallback: (err) => {
            if (err) {
              // If an error is thrown as a result of live updates being
              // disabled, then just close the subscription client.
              if (
                ((err as unknown) as Error).message ===
                  ERROR_CODES.LIVE_UPDATES_DISABLED &&
                subscriptionClient
              ) {
                subscriptionClient.close();
              }
            }
          },
          connectionParams: {
            [ACCESS_TOKEN_PARAM]: accessToken,
            [CLIENT_ID_PARAM]: clientID,
            [BUNDLE_ID_PARAM]: bundle,
            [BUNDLE_CONFIG_PARAM]: bundleConfig,
          },
        });
      }
      if (!operation.text && !operation.id) {
        throw Error("Neither subscription query nor id was provided.");
      }

      const opts: OperationOptions = {
        operationName: operation.name,
        // subscriptions-transport-ws requires `query` to be set to an non-empty string.
        // With persisted queries we only have the id, so set this to
        // "PERSISTED_QUERY" to get around validation.
        query: operation.text || "PERSISTED_QUERY",
        variables,
      };

      // Query is not available which means we can use the id from persisted queries.
      if (!operation.text) {
        opts.id = operation.id;
      }

      const subscription = subscriptionClient.request(opts).subscribe({
        next({ data }) {
          // Push data to batch and let the batch loop handle it.
          request.batch.push(data);
        },
      });
      request.unsubscribe = () => {
        // Run remaining batched response data before unsubscribing.
        reactBatchUpdates(() => {
          runBatch(request);
        });
        subscription.unsubscribe();
      };
    };

    // Register the request.
    requests.push(request);

    // Start subscription if we are not paused.
    if (!paused) {
      request.subscribe();

      // Debug subscriptions being logged. These should be kept here to help
      // with debugging subscriptions.
      if (process.env.NODE_ENV !== "production") {
        window.console.debug(
          `+1 [${requests.length - 1} + 1 = ${
            requests.length
          }] subscribe called for subscription:`,
          request.operation?.name,
          "with variables:",
          JSON.stringify(request.variables)
        );
      }
    }

    // When the subscription is disposed, this will be true.
    let disposed = false;

    return {
      dispose: () => {
        // Guard against double disposes. Multiple calls to dispose will now
        // result in no-ops.
        if (disposed) {
          return;
        }
        disposed = true;

        let closed = false;
        const i = requests.findIndex((r) => r === request);
        if (i !== -1) {
          // Unsubscribe if available.
          if (request.unsubscribe) {
            request.unsubscribe();
          }

          // Remove from requests list.
          requests.splice(i, 1);

          // Close client if there is no active subscription.
          if (
            subscriptionClient &&
            (requests.length === 0 || requests.every((r) => !r.unsubscribe))
          ) {
            closeClient();
            closed = true;
          }
        }

        // Debug subscriptions being logged. These should be kept here to help
        // with debugging subscriptions.
        if (process.env.NODE_ENV !== "production") {
          window.console.debug(
            `-1 [${requests.length + 1} - 1 = ${
              requests.length
            }] dispose called for subscription:`,
            request.operation?.name,
            "with variables:",
            JSON.stringify(request.variables)
          );

          if (closed) {
            window.console.debug(
              "subscription client disconnecting, no more subscriptions being tracked"
            );
          }
        }
      },
    };
  };

  const pause = () => {
    paused = true;
    // Unsubscribe from all active subscriptions.
    for (const r of requests) {
      if (r.unsubscribe) {
        r.unsubscribe();
        r.unsubscribe = null;
      }
    }
    // Close websocket connection.
    closeClient();
  };

  const resume = () => {
    // Resume all subscriptions.
    for (const r of requests) {
      if (!r.unsubscribe) {
        r.subscribe();
      }
    }
    paused = false;
  };

  const setAccessToken = (nextAccessToken?: string) => {
    accessToken = nextAccessToken;
  };

  return Object.freeze({
    subscribe,
    pause,
    resume,
    setAccessToken,
  });
}
