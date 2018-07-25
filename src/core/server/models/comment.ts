import { Db } from "mongodb";
import uuid from "uuid";

import { Omit, Sub } from "talk-common/types";
import {
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { ActionCounts } from "talk-server/models/actions";
import {
  Connection,
  Cursor,
  getPageInfo,
  nodesToEdges,
  NodeToCursorTransformer,
} from "talk-server/models/connection";
import Query from "talk-server/models/query";
import { TenantResource } from "talk-server/models/tenant";

function collection(db: Db) {
  return db.collection<Readonly<Comment>>("comments");
}

export interface BodyHistoryItem {
  body: string;
  created_at: Date;
}

export interface StatusHistoryItem {
  status: GQLCOMMENT_STATUS; // TODO: migrate field
  assigned_by?: string;
  created_at: Date;
}

export interface Comment extends TenantResource {
  readonly id: string;
  parent_id: string | null;
  author_id: string;
  asset_id: string;
  body: string;
  body_history: BodyHistoryItem[];
  status: GQLCOMMENT_STATUS;
  status_history: StatusHistoryItem[];
  action_counts: ActionCounts;
  reply_count: number;
  created_at: Date;
  deleted_at?: Date;
  metadata?: Record<string, any>;
}

export type CreateCommentInput = Omit<
  Comment,
  | "id"
  | "tenant_id"
  | "created_at"
  | "reply_count"
  | "body_history"
  | "status_history"
>;

export async function createComment(
  db: Db,
  tenantID: string,
  input: CreateCommentInput
) {
  const now = new Date();

  // Pull out some useful properties from the input.
  const { body, status } = input;

  // default are the properties set by the application when a new comment is
  // created.
  const defaults: Sub<Comment, CreateCommentInput> = {
    id: uuid.v4(),
    tenant_id: tenantID,
    created_at: now,
    reply_count: 0,
    body_history: [
      {
        body,
        created_at: now,
      },
    ],
    status_history: [
      {
        status,
        created_at: now,
      },
    ],
  };

  // Merge the defaults and the input together.
  const comment: Readonly<Comment> = {
    ...defaults,
    ...input,
  };

  // Insert it into the database.
  await collection(db).insertOne(comment);

  return comment;
}

export async function retrieveComment(db: Db, tenantID: string, id: string) {
  return collection(db).findOne({ id, tenant_id: tenantID });
}

export async function retrieveManyComments(
  db: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = await collection(db).find({
    id: {
      $in: ids,
    },
    tenant_id: tenantID,
  });

  const comments = await cursor.toArray();

  return ids.map(id => comments.find(comment => comment.id === id) || null);
}

export interface ConnectionInput {
  first: number;
  orderBy: GQLCOMMENT_SORT;
  after?: Cursor;
}

function cursorGetterFactory(
  input: ConnectionInput
): NodeToCursorTransformer<Comment> {
  switch (input.orderBy) {
    case GQLCOMMENT_SORT.CREATED_AT_DESC:
    case GQLCOMMENT_SORT.CREATED_AT_ASC:
      return comment => comment.created_at;
    case GQLCOMMENT_SORT.REPLIES_DESC:
    case GQLCOMMENT_SORT.RESPECT_DESC:
      return (_, index) =>
        (input.after ? (input.after as number) : 0) + index + 1;
  }
}

/**
 * retrieveRepliesConnection returns a Connection<Comment> for a given comments
 * replies.
 *
 * @param db database connection
 * @param parentID the parent id for the comment to retrieve
 * @param input connection configuration
 */
export async function retrieveCommentRepliesConnection(
  db: Db,
  tenantID: string,
  assetID: string,
  parentID: string,
  input: ConnectionInput
) {
  // Create the query.
  const query = new Query(collection(db)).where({
    tenant_id: tenantID,
    asset_id: assetID,
    parent_id: parentID,
  });

  // Return a connection for the comments query.
  return retrieveConnection(input, query);
}

/**
 * retrieveAssetConnection returns a Connection<Comment> for a given Asset's
 * comments.
 *
 * @param db database connection
 * @param assetID the Asset id for the comment to retrieve
 * @param input connection configuration
 */
export async function retrieveCommentAssetConnection(
  db: Db,
  tenantID: string,
  assetID: string,
  input: ConnectionInput
) {
  // Create the query.
  const query = new Query(collection(db)).where({
    tenant_id: tenantID,
    asset_id: assetID,
    parent_id: null,
  });

  // Return a connection for the comments query.
  return retrieveConnection(input, query);
}

/**
 * retrieveConnection returns a Connection<Comment> for the given input and
 * Query.
 *
 * @param input connection configuration
 * @param query the Query for the set of nodes that should have the connection
 *              configuration applied
 */
async function retrieveConnection(
  input: ConnectionInput,
  query: Query<Comment>
): Promise<Readonly<Connection<Readonly<Comment>>>> {
  // Apply some sorting options.
  applyInputToQuery(input, query);

  // We load one more than the limit so we can determine if there is
  // another page of entries. This gets trimmed off below after we've checked to
  // see if this constitutes another page of edges.
  query.first(input.first + 1);

  // Get the cursor.
  const cursor = await query.exec();

  // Get the comments from the cursor.
  const nodes = await cursor.toArray();

  // Convert the nodes to edges (which will include the extra edge we don't need
  // if there is more results).
  const edges = nodesToEdges(nodes, cursorGetterFactory(input));

  // Get the pageInfo for the connection. We will use this to also determine if
  // we need to trim off the extra edge that we requested by comparing its
  // hasNextPage parameter.
  const pageInfo = getPageInfo(input, edges);
  if (pageInfo.hasNextPage) {
    // Because this means that we got one more than expected, we should trim off
    // the extra edge that was retrieved.
    edges.splice(input.first, 1);
  }

  // Return the connection.
  return {
    edges,
    pageInfo,
  };
}

function applyInputToQuery(input: ConnectionInput, query: Query<Comment>) {
  switch (input.orderBy) {
    case GQLCOMMENT_SORT.CREATED_AT_DESC:
      query.orderBy({ created_at: -1 });
      if (input.after) {
        query.where({ created_at: { $lt: input.after as Date } });
      }
      break;
    case GQLCOMMENT_SORT.CREATED_AT_ASC:
      query.orderBy({ created_at: 1 });
      if (input.after) {
        query.where({ created_at: { $gt: input.after as Date } });
      }
      break;
    case GQLCOMMENT_SORT.REPLIES_DESC:
      query.orderBy({ reply_count: -1, created_at: -1 });
      if (input.after) {
        query.after(input.after as number);
      }
      break;
    case GQLCOMMENT_SORT.RESPECT_DESC:
      query.orderBy({ "action_counts.respect": -1, created_at: -1 });
      if (input.after) {
        query.after(input.after as number);
      }
      break;
  }
}
