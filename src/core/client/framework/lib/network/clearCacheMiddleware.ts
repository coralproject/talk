import { Middleware } from "react-relay-network-modern/es";

const clearCacheMiddleware: (clearCacheBefore?: Date) => Middleware = (
  clearCacheBefore
) => (next) => async (req) => {
  if (clearCacheBefore && new Date() < clearCacheBefore) {
    req.fetchOpts.cache = "no-cache";
  }

  return next(req);
};

export default clearCacheMiddleware;
