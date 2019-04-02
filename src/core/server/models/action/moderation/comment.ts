import { Db } from "mongodb";
import uuid from "uuid";

import { Omit, Sub } from "talk-common/types";
import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  Connection,
  ConnectionInput,
  resolveConnection,
} from "talk-server/models/helpers/connection";
import {
  createConnectionOrderVariants,
  createIndexFactory,
} from "talk-server/models/helpers/indexing";
import Query from "talk-server/models/helpers/query";
import { TenantResource } from "talk-server/models/tenant";

function collection(mongo: Db) {
  return mongo.collection<Readonly<CommentModerationAction>>(
    "commentModerationActions"
  );
}

export async function createCommentModerationActionIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  const createVariants = createConnectionOrderVariants<
    Readonly<CommentModerationAction>
  >([{ createdAt: -1 }]);

  // { moderatorID, ...connectionParams }
  await createVariants(createIndex, {
    moderatorID: 1,
  });
}

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
  input: CreateCommentModerationActionInput
) {
  // default are the properties set by the application when a new comment
  // moderation action is created.
  const defaults: Sub<
    CommentModerationAction,
    CreateCommentModerationActionInput
  > = {
    id: uuid.v4(),
    tenantID,
    createdAt: new Date(),
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
  const result = await collection(mongo).find({
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
  input: CommentModerationActionConnectionInput
): Promise<Readonly<Connection<Readonly<CommentModerationAction>>>> {
  // Create the query.
  const query = new Query(collection(mongo)).where({ tenantID });

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
  return resolveConnection(query, input, a => a.createdAt);
}
