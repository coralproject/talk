import { DataCache } from "coral-server/data/cache/dataCache";
import { MongoContext } from "coral-server/data/context";
import { FindSeenCommentsInput } from "coral-server/graph/loaders/SeenComments";
import {
  findSeenComments,
  markSeenComments,
} from "coral-server/models/seenComments/seenComments";
import { Tenant } from "coral-server/models/tenant";

export async function find(
  mongo: MongoContext,
  tenant: Tenant,
  input: FindSeenCommentsInput
) {
  return findSeenComments(mongo, tenant.id, input);
}

export async function markSeen(
  mongo: MongoContext,
  cache: DataCache,
  tenantID: string,
  storyID: string,
  userID: string,
  commentIDs: string[],
  now: Date,
  markAllAsSeen?: boolean
) {
  return await markSeenComments(
    mongo,
    cache,
    tenantID,
    storyID,
    userID,
    commentIDs,
    now,
    markAllAsSeen
  );
}
