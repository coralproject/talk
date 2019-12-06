import { identity, isEmpty, pickBy } from "lodash";
import { Db } from "mongodb";

import { DeepPartial } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import logger from "coral-server/logger";
import {
  retrieveUser,
  User,
  UserCommentCounts,
} from "coral-server/models/user";
import { users as collection } from "coral-server/services/mongodb/collections";
import { AugmentedRedis } from "coral-server/services/redis";

type UserCounts = DeepPartial<UserCommentCounts>;

export async function updateUserCommentCounts(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  id: string,
  commentCounts: UserCounts
) {
  // Update all the specific comment moderation queue counts.
  const update: DeepPartial<User> = { commentCounts };
  const $inc = pickBy(dotize(update), identity);
  if (isEmpty($inc)) {
    // Nothing needs to be incremented, just return the story.
    return retrieveUser(mongo, tenantID, id);
  }

  logger.trace({ update: { $inc } }, "incrementing story counts");

  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    { $inc },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}
