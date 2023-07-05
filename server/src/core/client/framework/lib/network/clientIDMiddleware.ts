import { Middleware } from "react-relay-network-modern/es";

import { CLIENT_ID_HEADER } from "coral-common/constants";

/**
 * Sets clientID on the header.
 *
 * @param clientID an identifier for this client.
 */
const clientIDMiddleware: (clientID: string) => Middleware =
  (clientID) => (next) => async (req) => {
    if (!req.fetchOpts.headers) {
      req.fetchOpts.headers = {};
    }
    req.fetchOpts.headers[CLIENT_ID_HEADER] = clientID;
    return next(req);
  };

export default clientIDMiddleware;
