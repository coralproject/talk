import { DirectiveResolverFn } from "@graphql-tools/utils";
import { DateTime } from "luxon";

import { RateLimitExceeded } from "coral-server/errors";
import { calculateLocationKey } from "coral-server/graph/directives/helpers";

import GraphContext from "../context";

export interface RateDirectiveArgs {
  max?: number;
  seconds?: number;
  key?: string;
}

const rate: DirectiveResolverFn<
  Record<string, string | undefined>,
  GraphContext
> = async (
  next,
  src,
  { max = 1, seconds, key: forceResource }: RateDirectiveArgs,
  { user, tenant, now, redis, config },
  info
) => {
  // If rate limiters are disabled, then just continue anyways now.
  if (config.get("disable_rate_limiters")) {
    return next();
  }

  // Check if the rate limiting makes sense.
  if (!seconds) {
    return next();
  }

  // Current implementations do not handle anonymous requests.
  if (!user) {
    // TODO: (wyattjoh) handle anonymous requests
    return next();
  }

  // Compute the resource key for this element.
  const resource = forceResource || calculateLocationKey(info);

  // TODO: (wyattjoh) depending on `resource`, maybe override (max, seconds)

  // Calculate the storage key from the resource and user identifiers.
  const key = `${tenant.id}:rl:${user.id}:${info.operation.operation}.${resource}`;

  // Perform the rate limiting check.
  const [[, tries]] = await redis.multi().incr(key).expire(key, seconds).exec();
  if (tries && tries > max) {
    const resetsAt = DateTime.fromJSDate(now).plus({ seconds }).toJSDate();
    throw new RateLimitExceeded(key, max, resetsAt, tries);
  }

  return next();
};

export default rate;
