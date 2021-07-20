import { RequestHandler } from "express";
import ms from "ms";

export const noCacheMiddleware: RequestHandler = (req, res, next) => {
  // Set cache control headers to prevent browsers/cdn's from caching these
  // requests.
  res.set("Cache-Control", "no-store");
  next();
};

const parseDuration = (duration: string | number) => {
  if (typeof duration === "string") {
    return Math.floor(ms(duration) / 1000);
  }

  return Math.floor(duration / 1000);
};

interface Options {
  sharedCacheDuration?: string | false | number;
  cacheDuration?: string | false | number;
  immutable?: boolean;
}

export const buildCacheControlHeader = ({
  sharedCacheDuration = false,
  cacheDuration = false,
  immutable = false,
}: Options = {}): string | null => {
  // Parse the passed duration to convert it to a max-age value.
  const maxAge = cacheDuration ? parseDuration(cacheDuration) : false;
  if (!maxAge) {
    return null;
  }

  // Set cache control headers to encourage browsers/cdn's to cache these
  // requests if we aren't in private mode.
  const directives: string[] = ["public", `max-age=${maxAge}`];

  // Push the shared max age into this set of directives if configured.
  const sMaxAge = sharedCacheDuration
    ? parseDuration(sharedCacheDuration)
    : false;
  if (sMaxAge) {
    directives.push(`s-max-age=${sMaxAge}`);
  }

  if (immutable) {
    directives.push("immutable");
  }

  // Join the directives together.
  return directives.join(", ");
};

export const cacheHeadersMiddleware = (options?: Options): RequestHandler => {
  const header = buildCacheControlHeader(options);
  if (!header) {
    return noCacheMiddleware;
  }

  return (req, res, next) => {
    res.set("Cache-Control", header);
    next();
  };
};
