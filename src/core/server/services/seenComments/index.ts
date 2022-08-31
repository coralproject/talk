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
  tenantID: string,
  storyID: string,
  userID: string,
  commentIDs: string[],
  now: Date,
  markAllAsSeen?: boolean
) {
  await markSeenComments(
    mongo,
    tenantID,
    storyID,
    userID,
    commentIDs,
    now,
    markAllAsSeen
  );
}
