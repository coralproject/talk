import { RequestHandler } from "express";
import ms from "ms";

export const nocacheMiddleware: RequestHandler = (req, res, next) => {
  // Set cache control headers to prevent browsers/cdn's from caching these
  // requests.
  res.set({ "Cache-Control": "no-cache, no-store, must-revalidate" });

  next();
};

export const cacheHeadersMiddleware = (duration: string): RequestHandler => {
  const maxAge = duration ? Math.floor(ms(duration) / 1000) : false;
  if (!maxAge) {
    return nocacheMiddleware;
  }

  return (req, res, next) => {
    // Set cache control headers to encourage browsers/cdn's to cache these
    // requests if we aren't in private mode.
    res.set({
      "Cache-Control": `public, max-age=${maxAge}`,
    });

    next();
  };
};
