import { Middleware, RelayRequestAny } from "react-relay-network-modern/es";

import { modifyQuery } from "coral-framework/utils";

function hasMutations(req: RelayRequestAny): boolean {
  return req.isMutation();
}

function queriesAreEmpty(req: RelayRequestAny): boolean {
  return req.getQueryString() === "";
}

function hasToken(req: RelayRequestAny): boolean {
  return "Authorization" in req.fetchOpts.headers;
}

/**
 * persistedQueriesGetMethodMiddleware will use the GET method instead of POST for
 * all request excluding mutations when persisted queries are used.
 * The request data will be encoded in base64url and set in the GET query string under
 * the variable "d=".
 */
const persistedQueriesGetMethodMiddleware: Middleware =
  (next) => async (req) => {
    if (queriesAreEmpty(req) && !hasMutations(req) && !hasToken(req)) {
      // Pull the body out (serializing it) and delete it off of the original
      // fetch options.
      const body: Record<string, any> = JSON.parse(
        req.fetchOpts.body as string
      );
      delete req.fetchOpts.body;

      // Reconfigure the fetch for GET.
      req.fetchOpts.method = "GET";

      // Rebuild the query parameters for GET.
      const params: Record<string, string> = { query: "" };
      for (const key in body) {
        if (!Object.prototype.hasOwnProperty.call(body, key)) {
          continue;
        }

        const value = body[key];
        params[key] = typeof value === "string" ? value : JSON.stringify(value);
      }

      // Combine the new parameters onto the URL.
      req.fetchOpts.url = modifyQuery(req.fetchOpts.url as string, params);
    }
    return next(req);
  };

export default persistedQueriesGetMethodMiddleware;
