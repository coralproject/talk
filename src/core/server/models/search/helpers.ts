import { InternalError } from "talk-server/errors";
import logger from "talk-server/logger";
import { Elasticsearch } from "talk-server/services/elasticsearch";

export const MAX_INDEXING_ATTEMPTS = 2;

export async function indexDocument<T extends { id: string }>(
  elasticsearch: Elasticsearch,
  doc: T,
  index: string,
  attemptsMade: number = 0
): Promise<any> {
  const log = logger.child({
    documentID: doc.id,
    index,
    attemptsMade,
  });

  try {
    log.debug("starting indexing operation");

    // Attempt to index the document.
    const result = await elasticsearch.index({
      id: doc.id,
      body: doc,
      // NOTE: (wyattjoh) removal of types https://www.elastic.co/guide/en/elasticsearch/reference/current/removal-of-types.html
      type: "_doc",
      index,
    });

    log.debug("index operation completed");

    return result;
  } catch (err) {
    if (isTimeoutError(err)) {
      if (attemptsMade < MAX_INDEXING_ATTEMPTS) {
        log.warn(
          { err },
          "request timed out trying to index, retrying index operation"
        );

        return indexDocument(elasticsearch, doc, index, attemptsMade + 1);
      } else {
        err = new InternalError(
          err,
          "maximum attempts made, will not retry timeed out operation"
        );
      }
    }

    log.error({ err }, "could not index the document");

    throw err;
  }
}

export function deleteDocument(
  elasticsearch: Elasticsearch,
  id: string,
  index: string
) {
  return elasticsearch.delete({
    id,
    // NOTE: (wyattjoh) removal of types https://www.elastic.co/guide/en/elasticsearch/reference/current/removal-of-types.html
    type: "_doc",
    // Ignore if the document is not already indexed.
    ignore: [404],
    index,
  });
}

export function isTimeoutError(err: any): boolean {
  return err.status === 408;
}
