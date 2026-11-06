import { ApolloServerPlugin } from "apollo-server-plugin-base";

import GraphContext from "../context";

/**
 * CacheControlApolloServerPlugin sets HTTP cache headers on GraphQL responses
 * to prevent authenticated responses from being shared across users by CDNs or
 * reverse proxies.
 *
 * - All GraphQL responses get `Vary: Authorization` so that caches key
 *   responses separately for authenticated vs unauthenticated requests.
 * - Authenticated responses additionally get `Cache-Control: private, no-store`
 *   so that shared caches (CDNs) never store user-specific data.
 */
export const CacheControlApolloServerPlugin: ApolloServerPlugin<GraphContext> =
  {
    requestDidStart() {
      return {
        willSendResponse({ context }) {
          const res = context.req?.res;
          if (!res) {
            return;
          }

          // Always vary by Authorization so that caches never serve an
          // unauthenticated (public) cached response to an authenticated user
          // or vice versa.
          res.vary("Authorization");

          // For authenticated requests, mark the response as private so that
          // shared caches (CDNs, reverse proxies) do not store it at all.
          if (context.user) {
            res.set("Cache-Control", "private, no-store");
          }
        },
      };
    },
  };

export default CacheControlApolloServerPlugin;
