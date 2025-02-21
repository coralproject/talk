import axios from "axios";
import Logger from "bunyan";

import { AugmentedRedis } from "../redis";

// TODO: Add to constants for use elsewhere
const disposableDomainRedisKey = ":disposable";
const disposableEmailsListUrl =
  "https://disposable.github.io/disposable-email-domains/domains_mx.txt";

export async function readDisposableEmailDomainsAndAddToRedis(
  redis: AugmentedRedis,
  logger: Logger
) {
  // TODO: Add check that at least one tenant has it enabled or else don't load in
  const stream = await axios.get(disposableEmailsListUrl, {
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
        // TODO: Set a reasonable expiration time
        await redis.set(
          `${domainToAdd}${disposableDomainRedisKey}`,
          now.toISOString()
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
        `${partialLine}${disposableDomainRedisKey}`,
        now.toISOString()
      );
    }
    logger.info("Finished streaming disposable emails list");
  });
}
