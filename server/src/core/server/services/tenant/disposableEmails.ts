import axios from "axios";

import { AugmentedRedis } from "../redis";

const disposableDomainRedisKey = ":disposable";
const disposableEmailsListUrl =
  "https://disposable.github.io/disposable-email-domains/domains_mx.txt";

export async function readDisposableEmailDomainsAndAddToRedis(
  redis: AugmentedRedis
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

      domainLines.forEach((domain: any, i: any) => {
        // TODO: Set a reasonable expiration time
        redis.set(`${domain}${disposableDomainRedisKey}`, now.toISOString());
      });
    } catch (error) {
      console.log(error, "Error");
    }
  });

  stream.data.on("end", () => {
    console.log("Stream finished");
  });
}
