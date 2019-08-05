import { Middleware } from "react-relay-network-modern/es";

interface RequestBody {
  id: any;
  query?: any;
  variables?: any;
}

/**
 * minifyBodyMiddleware removes an empty query or empty variables from the
 * body response.
 */
const minifyBodyMiddleware: Middleware = next => async req => {
  if (FormData && req.fetchOpts.body instanceof FormData) {
    return next(req);
  }
  if (req.fetchOpts.body) {
    const data = JSON.parse(req.fetchOpts.body as string) as RequestBody;
    if ("query" in data && !data.query) {
      delete data.query;
    }
    if ("variables" in data && Object.keys(data.variables).length === 0) {
      delete data.variables;
    }
    req.fetchOpts.body = JSON.stringify(data);
  }
  return next(req);
};

export default minifyBodyMiddleware;
