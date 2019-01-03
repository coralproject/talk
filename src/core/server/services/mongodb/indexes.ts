import { Db } from "mongodb";

import logger from "talk-server/logger";
import { createCommentActionIndexes } from "talk-server/models/action/comment";
import { createCommentModerationActionIndexes } from "talk-server/models/action/moderation/comment";
import { createCommentIndexes } from "talk-server/models/comment";
import {
  createStoryCountIndexes,
  createStoryIndexes,
} from "talk-server/models/story";
import { createTenantIndexes } from "talk-server/models/tenant";
import { createUserIndexes } from "talk-server/models/user";

type IndexCreationFunction = (mongo: Db) => Promise<void>;

const indexes: Array<[string, IndexCreationFunction]> = [
  ["users", createUserIndexes],
  ["tenants", createTenantIndexes],
  ["comments", createCommentIndexes],
  ["stories", createStoryIndexes],
  ["stories", createStoryCountIndexes],
  ["commentActions", createCommentActionIndexes],
  ["commentModerationActions", createCommentModerationActionIndexes],
];

/**
 * ensureIndexes will ensure that all indexes have been created.
 *
 * @param mongo a MongoDB Database Connection
 */
export async function ensureIndexes(mongo: Db) {
  logger.debug(
    { indexGroupCount: indexes.length },
    "now ensuring indexes are created"
  );

  // For each of the index functions, call it.
  for (const [indexGroup, indexFunction] of indexes) {
    logger.debug({ indexGroup }, "ensuring indexes are created");
    await indexFunction(mongo);
    logger.debug({ indexGroup }, "indexes have been created");
  }

  logger.debug("all indexes have been created");
}
