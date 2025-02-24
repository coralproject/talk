import axios from "axios";
import Logger from "bunyan";

import {
  DISPOSABLE_EMAIL_DOMAIN_CACHE_DURATION,
  DISPOSABLE_EMAIL_DOMAINS_LIST_URL,
  DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY,
} from "coral-common/common/lib/constants";

import { AugmentedRedis } from "../redis";

export async function readDisposableEmailDomainsAndAddToRedis(
  redis: AugmentedRedis,
  logger: Logger
) {
  const stream = await axios.get(DISPOSABLE_EMAIL_DOMAINS_LIST_URL, {
    responseType: "stream",
  });

  const now = new Date();

  // This is to keep track of the last line in each chunk; sometimes these are partial
  // lines that need to be joined up with the first line in the next chunk
  let partialLine = "";
  let firstChunkProcessed = false;
  stream.data.on("data", async (chunk: any) => {
    const stringChunk = chunk.toString("utf-8");
    try {
      const domainLines = stringChunk.split("\n");
      const domainLinesLastIndex = domainLines.length - 1;

      domainLines.forEach(async (domain: string, i: number) => {
        let domainToAdd = domain;
        if (i === 0) {
          // If there was any partial line as the last element sent through in the previous
          // chunk, we add it to the first line in this next chunk
          if (!firstChunkProcessed) {
            firstChunkProcessed = true;
          } else {
            domainToAdd = partialLine + domain;
          }
        }

        // We set the last element sent through in the chunk as the partialLine, so that
        // it can be added to the first element in the next chunk
        if (i === domainLinesLastIndex) {
          partialLine = domain;
        }
        await redis.set(
          `${domainToAdd}${DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY}`,
          now.toISOString(),
          "EXP",
          DISPOSABLE_EMAIL_DOMAIN_CACHE_DURATION
        );
      });
    } catch (error) {
      logger.error(
        "Error reading and setting disposable emails in Redis:",
        error
      );
    }
  });

  stream.data.on("end", async () => {
    // This sets the very last domain into Redis
    if (partialLine !== "") {
      await redis.set(
        `${partialLine}${DISPOSABLE_EMAIL_DOMAINS_REDIS_KEY}`,
        now.toISOString()
      );
    }
    logger.info("Finished streaming disposable emails list");
  });
}
