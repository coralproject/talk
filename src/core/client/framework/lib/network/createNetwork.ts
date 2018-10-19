import {
  authMiddleware,
  batchMiddleware,
  cacheMiddleware,
  RelayNetworkLayer,
  retryMiddleware,
  urlMiddleware,
} from "react-relay-network-modern/es";

import customErrorMiddleware from "./customErrorMiddleware";

export type TokenGetter = () => string;

const graphqlURL = "/api/tenant/graphql";

export default function createNetwork(tokenGetter: TokenGetter) {
  return new RelayNetworkLayer([
    customErrorMiddleware,
    cacheMiddleware({
      size: 100, // max 100 requests
      ttl: 900000, // 15 minutes
      clearOnMutation: true,
    }),
    urlMiddleware({
      url: req => Promise.resolve(graphqlURL),
    }),
    batchMiddleware({
      batchUrl: (requestMap: any) => Promise.resolve(graphqlURL),
      batchTimeout: 10,
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
  ]);
}
