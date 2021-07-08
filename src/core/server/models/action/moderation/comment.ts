import { Db } from "mongodb";
import { v4 as uuid } from "uuid";

import { Sub } from "coral-common/types";
import { Config } from "coral-server/config";
import {
  Connection,
  ConnectionInput,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { TenantResource } from "coral-server/models/tenant";
import { commentModerationActions as collection } from "coral-server/services/mongodb/collections";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

/**
 * CommentModerationAction stores information around a moderation action that
 * was created for a given Comment Revision.
 */
export interface CommentModerationAction extends TenantResource {
  readonly id: string;

  /**
   * commentID is the ID of the Comment that the moderation action is based on.
   */
  commentID: string;

  /**
   * commentRevisionID is the ID of the Revision that the moderation action is
   * based on.
   */
  commentRevisionID: string;

  /**
   * status is the GQLCOMMENT_STATUS assigned by the moderator for this
   * moderation action.
   */
  status: GQLCOMMENT_STATUS;

  /**
   * moderatorID is the ID of the User that created the moderation action. If
   * null, it indicates that it was created by the system rather than a User.
   */
  moderatorID: string | null;

  /**
   * createdAt is the time that the moderation action was created on.
   */
  createdAt: Date;
}

export type CreateCommentModerationActionInput = Omit<
  CommentModerationAction,
  "tenantID" | "id" | "createdAt"
>;

export async function createCommentModerationAction(
  mongo: Db,
  tenantID: string,
  input: CreateCommentModerationActionInput,
  now: Date
) {
  // default are the properties set by the application when a new comment
  // moderation action is created.
  const defaults: Sub<
    CommentModerationAction,
    CreateCommentModerationActionInput
  > = {
    id: uuid(),
    tenantID,
    createdAt: now,
  };

  // Merge the defaults and the input together.
  const action: Readonly<CommentModerationAction> = {
    ...defaults,
    ...input,
  };

  // Insert it into the database.
  await collection(mongo).insertOne(action);

  return action;
}

export type CommentModerationActionFilter = Partial<
  Pick<
    CommentModerationAction,
    "commentID" | "commentRevisionID" | "moderatorID" | "status"
  >
>;

export async function retrieveCommentModerationActions(
  mongo: Db,
  tenantID: string,
  filter: CommentModerationActionFilter
) {
  const result = collection(mongo).find({
    tenantID,
    ...filter,
  });

  return result.toArray();
}

export type CommentModerationActionConnectionInput = ConnectionInput<
  CommentModerationAction
>;

export async function retrieveCommentModerationActionConnection(
  mongo: Db,
  tenantID: string,
  config: Config,
  input: CommentModerationActionConnectionInput
): Promise<Readonly<Connection<Readonly<CommentModerationAction>>>> {
  // Create the query.
  const query = new Query(collection(mongo)).where({ tenantID });

  // If a filter is being applied, filter it as well.
  if (input.filter) {
    query.where(input.filter);
  }

  return retrieveConnection(config.get("mongo_query_timeout"), input, query);
}

async function retrieveConnection(
  timeoutMs: number,
  input: CommentModerationActionConnectionInput,
  query: Query<CommentModerationAction>
): Promise<Readonly<Connection<Readonly<CommentModerationAction>>>> {
  // Apply the cursor to the query. Currently only supporting sorting by the
  // newest first.
  query.orderBy({ createdAt: -1 });
  if (input.after) {
    query.where({ createdAt: { $lt: input.after as Date } });
  } else {
    // We need to force the query planner to know to bail out
    // early in the index search based on date rather than
    // retrieving all comments and then trying to sort them all.
    // This tells it we care about date order in index traversal.
    query.where({ createdAt: { $gt: new Date(0) } });
  }

  // Return a connection.
  return resolveConnection(query, input, (a) => a.createdAt, timeoutMs);
}
