import base64url from "base64url";
import {
  Middleware,
  RelayRequestAny,
  RelayRequestBatch,
} from "react-relay-network-modern/es";

import { modifyQuery } from "coral-framework/utils";

function isBatch(req: RelayRequestAny): req is RelayRequestBatch {
  return "requests" in req;
}

function hasMutations(req: RelayRequestAny): boolean {
  if (!isBatch(req)) {
    return req.isMutation();
  }
  return req.requests.some(r => r.isMutation());
}

function queriesAreEmpty(req: RelayRequestAny): boolean {
  if (!isBatch(req)) {
    return req.getQueryString() === "";
  }
  return req.requests.every(r => r.getQueryString() === "");
}

/**
 * persistedQueriesGetMethodMiddleware will use the GET method instead of POST for
 * all request excluding mutations when persisted queries are used.
 * The request data will be encoded in base64url and set in the GET query string under
 * the variable "d=".
 */
const persistedQueriesGetMethodMiddleware: Middleware = next => async req => {
  if (queriesAreEmpty(req) && !hasMutations(req)) {
    const data = base64url(req.fetchOpts.body as string);
    req.fetchOpts.body = undefined;
    req.fetchOpts.method = "GET";
    req.fetchOpts.url = modifyQuery(req.fetchOpts.url as string, {
      d: data,
    });
  }
  return next(req);
};

export default persistedQueriesGetMethodMiddleware;
