import axios from "axios";
import Logger from "bunyan";

import { AugmentedRedis } from "../redis";

const disposableDomainRedisKey = ":disposable";
const disposableEmailsListUrl =
  "https://disposable.github.io/disposable-email-domains/domains_mx.txt";

export async function readDisposableEmailDomainsAndAddToRedis(
  redis: AugmentedRedis,
  logger: Logger
) {
  // TODO: Add check for feature flag
  const stream = await axios.get(disposableEmailsListUrl, {
    responseType: "stream",
  });

  const now = new Date();

  stream.data.on("data", (chunk: any) => {
    const stringChunk = chunk.toString("utf-8");
    try {
      const domainLines = stringChunk.split("\n");

      domainLines.forEach(async (domain: any, i: any) => {
        // TODO: Set a reasonable expiration time
        await redis.set(
          `${domain}${disposableDomainRedisKey}`,
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

  stream.data.on("end", () => {
    logger.info("Finished streaming disposable emails list");
  });
}
