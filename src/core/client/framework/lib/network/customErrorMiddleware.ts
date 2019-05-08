import { Middleware } from "react-relay-network-modern/es";

import extractGraphQLError from "./extractGraphQLError";

const customErrorMiddleware: Middleware = next => async req => {
  const res = await next(req);
  if (res.errors) {
    // Extract custom error.
    const error = extractGraphQLError(res.errors);
    if (error) {
      throw error;
    }
  }
  return res;
};

export default customErrorMiddleware;
