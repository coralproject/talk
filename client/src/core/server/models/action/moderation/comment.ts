import { v4 as uuid } from "uuid";

import { Sub } from "coral-common/types";
import { MongoContext } from "coral-server/data/context";
import {
  Connection,
  ConnectionInput,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { TenantResource } from "coral-server/models/tenant";

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
   * storyID is the ID of the Story that the moderated Comment was on.
   */
  storyID: string;

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
  mongo: MongoContext,
  tenantID: string,
  input: CreateCommentModerationActionInput,
  now: Date,
  isArchived = false
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

  const coll =
    isArchived && mongo.archive
      ? mongo.archivedCommentModerationActions()
      : mongo.commentModerationActions();

  // Insert it into the database.
  await coll.insertOne(action);

  return action;
}

export type CommentModerationActionFilter = Partial<
  Pick<
    CommentModerationAction,
    "commentID" | "commentRevisionID" | "moderatorID" | "status"
  >
>;

export async function retrieveCommentModerationActions(
  mongo: MongoContext,
  tenantID: string,
  filter: CommentModerationActionFilter
) {
  const result = mongo.commentModerationActions().find({
    tenantID,
    ...filter,
  });

  return result.toArray();
}

export type CommentModerationActionConnectionInput =
  ConnectionInput<CommentModerationAction>;

export async function retrieveCommentModerationActionConnection(
  mongo: MongoContext,
  tenantID: string,
  input: CommentModerationActionConnectionInput
): Promise<Readonly<Connection<Readonly<CommentModerationAction>>>> {
  // Create the query.
  const query = new Query(mongo.commentModerationActions()).where({ tenantID });

  // If a filter is being applied, filter it as well.
  if (input.filter) {
    query.where(input.filter);
  }

  return retrieveConnection(input, query);
}

async function retrieveConnection(
  input: CommentModerationActionConnectionInput,
  query: Query<CommentModerationAction>
): Promise<Readonly<Connection<Readonly<CommentModerationAction>>>> {
  // Apply the cursor to the query. Currently only supporting sorting by the
  // newest first.
  query.orderBy({ createdAt: -1 });
  if (input.after) {
    query.where({ createdAt: { $lt: input.after as Date } });
  }

  // Return a connection.
  return resolveConnection(query, input, (a) => a.createdAt);
}
