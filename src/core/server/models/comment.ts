import { merge } from "lodash";
import { Db } from "mongodb";
import { Omit, Sub } from "talk-common/types";
import { ActionCounts } from "talk-server/models/actions";
import { Connection, Cursor, Edge } from "talk-server/models/connection";
import Query from "talk-server/models/query";
import { TenantResource } from "talk-server/models/tenant";
import uuid from "uuid";

function collection(db: Db) {
  return db.collection<Readonly<Comment>>("comments");
}

export interface BodyHistoryItem {
  body: string;
  created_at: Date;
}

export interface StatusHistoryItem {
  status: CommentStatus; // TODO: migrate field
  assigned_by?: string;
  created_at: Date;
}

export enum CommentStatus {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PREMOD = "PREMOD",
  SYSTEM_WITHHELD = "SYSTEM_WITHHELD",
  NONE = "NONE",
}

export interface Comment extends TenantResource {
  readonly id: string;
  parent_id?: string;
  author_id: string;
  asset_id: string;
  body: string;
  body_history: BodyHistoryItem[];
  status: CommentStatus;
  status_history: StatusHistoryItem[];
  action_counts: ActionCounts;
  reply_count: number;
  created_at: Date;
  deleted_at?: Date;
  metadata?: {
    [_: string]: any;
  };
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

export async function create(
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
  const comment: Readonly<Comment> = merge({}, defaults, input);

  // TODO: Check for existence of the parent ID before we create the comment.

  // TODO: Check for existence of the asset ID before we create the comment.

  // Insert it into the database.
  await collection(db).insertOne(comment);

  // TODO: update reply count of parent if exists.

  return comment;
}

export async function retrieve(db: Db, tenantID: string, id: string) {
  return collection(db).findOne({ id, tenant_id: tenantID });
}

export async function retrieveMany(db: Db, tenantID: string, ids: string[]) {
  const cursor = await collection(db).find({
    id: {
      $in: ids,
    },
    tenant_id: tenantID,
  });

  const comments = await cursor.toArray();

  return ids.map(id => comments.find(comment => comment.id === id) || null);
}

export enum CommentSort {
  CREATED_AT_DESC = "CREATED_AT_DESC",
  CREATED_AT_ASC = "CREATED_AT_ASC",
  REPLIES_DESC = "REPLIES_DESC",
  RESPECT_DESC = "RESPECT_DESC",
}

export interface ConnectionInput {
  first: number;
  orderBy: CommentSort;
  after?: Cursor;
}

/**
 * nodesToEdge converts a set of nodes and configuration options into a set of
 * edges.
 *
 * @param input connection configuration
 * @param nodes nodes returned from the query
 */
function nodesToEdge(input: ConnectionInput, nodes: Comment[]) {
  let getCursor: (comment: Comment, index: number) => Cursor;
  switch (input.orderBy) {
    case CommentSort.CREATED_AT_DESC:
    case CommentSort.CREATED_AT_ASC:
      getCursor = comment => comment.created_at;
      break;
    case CommentSort.REPLIES_DESC:
    case CommentSort.RESPECT_DESC:
      getCursor = (_, index) =>
        (input.after ? (input.after as number) : 0) + index + 1;
      break;
  }

  return nodes.map((comment, index) => ({
    node: comment,
    cursor: getCursor(comment, index),
  }));
}

/**
 * retrieveRepliesConnection returns a Connection<Comment> for a given comments
 * replies.
 *
 * @param db database connection
 * @param parentID the parent id for the comment to retrieve
 * @param input connection configuration
 */
export async function retrieveRepliesConnection(
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
export async function retrieveAssetConnection(
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
) {
  // Apply some sorting options.
  switch (input.orderBy) {
    case CommentSort.CREATED_AT_DESC:
      query.orderBy({ created_at: -1 });
      if (input.after) {
        query.where({ created_at: { $lt: input.after as Date } });
      }
      break;
    case CommentSort.CREATED_AT_ASC:
      query.orderBy({ created_at: 1 });
      if (input.after) {
        query.where({ created_at: { $gt: input.after as Date } });
      }
      break;
    case CommentSort.REPLIES_DESC:
      query.orderBy({ reply_count: -1, created_at: -1 });
      if (input.after) {
        query.after(input.after as number);
      }
      break;
    case CommentSort.RESPECT_DESC:
      query.orderBy({ "action_counts.respect": -1, created_at: -1 });
      if (input.after) {
        query.after(input.after as number);
      }
      break;
  }

  // We load one more than the limit so we can determine if there is
  // another page of entries.
  query.first(input.first + 1);

  // Get the cursor.
  const cursor = await query.exec();

  // Get the comments from the cursor.
  const nodes = await cursor.toArray();

  // The hasNextPage is always handled the same (ask for one more than we need,
  // if there is one more, than there is more).
  let hasNextPage = false;
  if (input.first >= 0 && nodes.length > input.first) {
    // There was one more than we expected! Set hasNextPage = true and remove
    // the last item from the array that we requested.
    hasNextPage = true;
    nodes.splice(input.first, 1);
  }

  // Convert the nodes to edges.
  const edges = nodesToEdge(input, nodes);

  // Return the connection.
  const connection: Readonly<Connection<Readonly<Comment>>> = {
    edges,
    pageInfo: {
      hasNextPage,
    },
  };

  return connection;
}
