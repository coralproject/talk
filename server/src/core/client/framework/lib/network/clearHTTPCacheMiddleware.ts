import { Middleware } from "react-relay-network-modern/es";

const clearHTTPCacheMiddleware: (clearCacheBefore?: Date) => Middleware =
  (clearCacheBefore) => (next) => async (req) => {
    if (clearCacheBefore && new Date() < clearCacheBefore) {
      req.fetchOpts.headers["Cache-Control"] = "no-store";
      req.fetchOpts.headers.Pragma = "no-store";
    }

    return next(req);
  };

export default clearHTTPCacheMiddleware;
