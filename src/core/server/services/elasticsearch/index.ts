import { Client } from "elasticsearch";

import { Config } from "talk-server/config";
import { InternalError } from "talk-server/errors";

export type Elasticsearch = Client;

// FIXME: (wyattjoh) Evaluate Elasticsearch Scrolling API: https://www.elastic.co/guide/en/elasticsearch/guide/current/scroll.html

export async function createElasticsearchClient(
  config: Config
): Promise<Elasticsearch> {
  try {
    const client = new Client({
      host: config.get("elasticsearch"),
    });

    // Ping the elasticsearch instance to verify we have valid connection
    // credentials.
    await client.ping({
      requestTimeout: 2000,
    });

    return client;
  } catch (err) {
    throw new InternalError(err, "could not connect to elasticsearch");
  }
}
