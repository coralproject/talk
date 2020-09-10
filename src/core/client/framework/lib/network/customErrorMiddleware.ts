import { Middleware, RRNLRequestError } from "react-relay-network-modern/es";

import { NetworkOfflineError, RelayNetworkRequestError } from "../errors";
import extractGraphQLError from "./extractGraphQLError";

function isRRNLRequestError(error: Error): error is RRNLRequestError {
  return error.name === "RRNLRequestError";
}

const customErrorMiddleware: Middleware = (next) => async (req) => {
  try {
    const res = await next(req);
    if (res.errors) {
      // Extract custom error.
      const error = extractGraphQLError(res.errors);
      if (error) {
        throw error;
      }
    }
    return res;
  } catch (error) {
    if (
      navigator.onLine === false ||
      (error.name === "TypeError" && error.message === "Failed to fetch")
    ) {
      throw new NetworkOfflineError(error);
    }
    if (isRRNLRequestError(error)) {
      throw new RelayNetworkRequestError(error);
    }
    throw error;
  }
};

export default customErrorMiddleware;
