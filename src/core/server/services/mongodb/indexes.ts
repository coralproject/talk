import { Db } from "mongodb";

import logger from "coral-server/logger";
import { createCommentActionIndexes } from "coral-server/models/action/comment";
import { createCommentModerationActionIndexes } from "coral-server/models/action/moderation/comment";
import { createCommentIndexes } from "coral-server/models/comment";
import { createInviteIndexes } from "coral-server/models/invite";
import {
  createStoryCountIndexes,
  createStoryIndexes,
} from "coral-server/models/story";
import { createTenantIndexes } from "coral-server/models/tenant";
import { createUserIndexes } from "coral-server/models/user";

type IndexCreationFunction = (mongo: Db) => Promise<void>;

const indexes: Array<[string, IndexCreationFunction]> = [
  ["users", createUserIndexes],
  ["invites", createInviteIndexes],
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
