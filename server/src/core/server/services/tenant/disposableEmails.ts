import axios from "axios";
import Logger from "bunyan";
import { Parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";

import {
  DISPOSABLE_EMAIL_DOMAINS_LIST_URL,
  DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY,
} from "coral-common/common/lib/constants";

import { AugmentedRedis } from "../redis";

export async function readDisposableEmailDomainsAndAddToRedis(
  redis: AugmentedRedis,
  logger: Logger
) {
  const now = new Date().toISOString();

  // clear previous disposable domains before loading in new
  await redis.del(DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY);

  try {
    const stream = await axios.get(`${DISPOSABLE_EMAIL_DOMAINS_LIST_URL}`, {
      responseType: "stream",
    });

    const pipeline = stream.data.pipe(new Parser()).pipe(streamArray());

    pipeline.on("data", async (data: { value: string }) => {
      const domain = data.value;
      await redis.hset(DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY, domain, now);
    });

    pipeline.on("end", () => {
      logger.info("Finished streaming disposable emails list");
    });

    pipeline.on("error", (error: any) => {
      logger.error(
        "Error reading and setting disposable emails in Redis:",
        error
      );
    });
  } catch (error) {
    logger.error(
      "Error streaming and setting disposable emails in Redis:",
      error
    );
  }
}
