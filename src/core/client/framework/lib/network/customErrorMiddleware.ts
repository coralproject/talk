import { Middleware, RRNLRequestError } from "react-relay-network-modern/es";

import { RelayNetworkRequestError } from "../errors";
import assertOnline from "./assertOnline";
import parseGraphQLResponseErrors from "./parseGraphQLResponseErrors";

function isRRNLRequestError(error: Error): error is RRNLRequestError {
  return error.name === "RRNLRequestError";
}

const customErrorMiddleware: Middleware = (next) => async (req) => {
  try {
    const res = await next(req);
    if (res.errors) {
      // Extract custom error.
      const error = parseGraphQLResponseErrors(res.errors);
      if (error) {
        throw error;
      }
    }
    return res;
  } catch (error) {
    // Make sure we are online, otherwise throw.
    assertOnline(error);
    if (isRRNLRequestError(error)) {
      throw new RelayNetworkRequestError(error);
    }
    throw error;
  }
};

export default customErrorMiddleware;
