import { Redis } from "ioredis";

import logger from "coral-server/logger";
import { RequestHandler } from "coral-server/types/express";

interface CacheEntry {
  headers: Record<string, any>;
  status: number;
  body: string;
  createdAt: number;
}

const cacheMiddleware = (redis: Redis, ttl: number): RequestHandler => async (
  req,
  res,
  next
) => {
  // Compute the cache key.
  const key = `rmc:${req.hostname}:${req.originalUrl}`;
  const log = logger.child({ key }, true);

  // Try to lookup the entry in the cache.
  const value = await redis.get(key);
  if (value) {
    log.debug("request was in the cache");

    // Found an entry! Unpack it and sent the response!
    const entry: CacheEntry = JSON.parse(value);

    // Set the headers on the request.
    res.set({
      ...entry.headers,
      age: Math.floor((Date.now() - entry.createdAt) / 1000),
    });

    // Set the status on the request.
    res.status(entry.status);

    // Send the body on the request.
    return res.send(entry.body);
  }

  log.debug("request was not in the cache");

  const send = res.send.bind(res);
  res.send = (body) => {
    // Send the response to the client.
    const ret = send(body);

    // Create a new cache entry.
    const entry: CacheEntry = {
      headers: res.getHeaders(),
      status: res.statusCode,
      body,
      createdAt: Date.now(),
    };

    // Add it in Redis.
    redis
      .set(key, JSON.stringify(entry), "PX", ttl)
      .then(() => {
        log.debug("request added to cache");
      })
      .catch((err) => {
        log.error({ err }, "could not add request to cache");
      });

    return ret;
  };

  return next();
};

export default cacheMiddleware;
