import { Middleware } from "react-relay-network-modern/es";

/**
 * Sets `Coral-Client-ID` on the header.
 * @param clientID an identifier for this client.
 */
const clientIDMiddleware: (
  clientID: string
) => Middleware = clientID => next => async req => {
  if (!req.fetchOpts.headers) {
    req.fetchOpts.headers = {};
  }
  req.fetchOpts.headers["X-Coral-Client-ID"] = clientID;
  return next(req);
};

export default clientIDMiddleware;
