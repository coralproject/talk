import Logger from "bunyan";

import {
  DISPOSABLE_EMAIL_DOMAINS_LIST_URL,
  DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY,
} from "coral-common/common/lib/constants";
import { createFetch } from "coral-server/services/fetch";

import { AugmentedRedis } from "../redis";

export async function readDisposableEmailDomainsAndAddToRedis(
  redis: AugmentedRedis,
  logger: Logger
) {
  const now = new Date().toISOString();

  const fetch = createFetch({ name: "disposableDomains" });

  try {
    // the list is 242 KB, even if it were 1000 times larger,
    // that's still less than 250 MB, well within a pods capability
    // so we are okay loading with fetch
    const response = await fetch(DISPOSABLE_EMAIL_DOMAINS_LIST_URL);
    if (!response) {
      logger.error("Error retrieving disposable emails from request");
      return;
    }

    const json = (await response.json()) as string[];
    if (!json) {
      logger.error(
        "Error reading disposable emails from request to json array"
      );
      return;
    }

    // need to use a transaction to make the delete followed by
    // populating the hash set an atomic operation so that
    // pods don't race condition delete the set out from under
    // the writes
    const transaction = redis.multi();

    transaction.del(DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY);

    for (const value of json) {
      transaction.hset(DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY, value, now);
    }

    await transaction.exec();
  } catch (error) {
    logger.error(
      "Error streaming and setting disposable emails in Redis:",
      error
    );
  }
}
