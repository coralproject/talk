import { Middleware } from "react-relay-network-modern/es";

import extractError from "./extractError";

const customErrorMiddleware: Middleware = next => async req => {
  const res = await next(req);
  if (res.errors) {
    // Extract custom error.
    const error = extractError(res.errors);
    if (error) {
      throw error;
    }
  }
  return res;
};

export default customErrorMiddleware;
