import fs from "fs-extra";
import { parse } from "graphql";
import path from "path";

import { version } from "coral-common/version";
import { getOperationMetadata } from "coral-server/graph/plugins";
import logger from "coral-server/logger";
import { PersistedQuery } from "coral-server/models/queries";

export function loadPersistedQueries(): PersistedQuery[] {
  // Check to see if we have a persisted queries folder.
  const dir = path.join(__dirname, "__generated__");
  if (!fs.pathExistsSync(dir)) {
    logger.warn(
      { dir },
      "persisted queries not loaded, dir not found; did you run `npm run generate-persist`?"
    );
    return [];
  }

  // Load the files in the persisted queries folder.
  const files = fs.readdirSync(dir);

  // Load each of the persisted queries.
  const queries: PersistedQuery[] = [];
  for (const filePath of files) {
    // Parse the bundle name from the file.
    const bundle = filePath.split(".")[0];

    // Load the queries from this file.
    const fullFilePath = path.join(dir, filePath);
    const persistedQueries: Record<string, string> = fs.readJSONSync(
      fullFilePath
    );

    // Go over each of the persisted queries and collect the ID and query to
    // merge in.
    for (const id in persistedQueries) {
      if (!Object.prototype.hasOwnProperty.call(persistedQueries, id)) {
        continue;
      }

      // Grab the actual query out of the file.
      const query = persistedQueries[id];

      // Parse the file to extract the GraphQL Operation Name.
      const { operation, operationName } = getOperationMetadata(parse(query));
      if (!operation || !operationName) {
        throw new Error(
          `operation in ${fullFilePath} with ID ${id} does not have valid operation metadata`
        );
      }

      queries.push({
        id,
        operation,
        operationName,
        query,
        bundle,
        version,
      });
    }
  }

  logger.info({ queries: queries.length }, "loaded persisted queries");

  return queries;
}
