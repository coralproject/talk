import { Redis } from "ioredis";

import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";

interface KeySpec {
  tenantID: string;
  siteID: string;
  storyID: string;
}

function formatKey({ tenantID, siteID, storyID }: KeySpec, time: number) {
  return `storyViewers:${tenantID}:${siteID}:${storyID}:${time}`;
}

function formatTime(now: Date, precision: number): number {
  return Math.floor(now.getTime() / precision);
}

function calculateReadKey(spec: KeySpec, precision: number, now: Date) {
  return formatKey(spec, formatTime(now, precision));
}

interface Keys {
  /**
   * current is the key for the current time.
   */
  current: string;

  /**
   * next is the key for the next time.
   */
  next: string;
}

function calculateWriteKeys(spec: KeySpec, precision: number, now: Date): Keys {
  return {
    current: formatKey(spec, formatTime(now, precision)),
    next: formatKey(spec, formatTime(now, precision) + 1),
  };
}

export async function createStoryViewer(
  redis: Redis,
  spec: KeySpec,
  clientID: string,
  precision: number,
  now = new Date()
): Promise<number> {
  const timer = createTimer();

  // Compute the key for this entry.
  const { current, next } = calculateWriteKeys(spec, precision, now);

  // Add a new viewer to the set, and expire it after the precision.
  const multi = redis.multi(); // O(1)

  // Add the new viewer to the set...
  multi.sadd(current, clientID); // O(1)

  // And expire the entire set after the precision time...
  multi.pexpire(current, precision); // O(1)

  // Add the new viewer to the next set...
  multi.sadd(next, clientID); // O(1)

  // And expire that entire set after twice the precision time...
  multi.pexpire(next, precision * 2); // O(1)

  // Get the current count.
  multi.scard(current); // O(1)

  // Do this now.
  const [, , , , [, count]] = await multi.exec();

  logger.info({ took: timer(), count, spec }, "created story viewer");

  return count;
}

export async function removeStoryViewer(
  redis: Redis,
  spec: KeySpec,
  clientID: string,
  precision: number,
  now = new Date()
): Promise<number> {
  const timer = createTimer();

  // Compute the key for this entry.
  const { current, next } = calculateWriteKeys(spec, precision, now);

  const multi = redis.multi();

  // Remove this clientID from the current and next set.
  multi.srem(current, clientID); // O(1)
  multi.srem(next, clientID); // O(1)

  // Get the current count.
  multi.scard(current); // O(1)

  // Do this now.
  const [, , [, count]] = await multi.exec();

  logger.info({ took: timer(), count, spec }, "removed story viewer");

  return count;
}

export async function countStoryViewers(
  redis: Redis,
  spec: KeySpec,
  precision: number,
  now = new Date()
) {
  const timer = createTimer();

  // Compute the key for this entry.
  const key = calculateReadKey(spec, precision, now);

  // Count the number of clientID's.
  const count = await redis.scard(key);

  logger.info({ took: timer(), count, spec }, "counted story viewers");

  return count;
}
