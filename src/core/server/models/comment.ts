import { Db } from "mongodb";
import uuid from "uuid";

import { Omit, Sub } from "talk-common/types";
import { dotize } from "talk-common/utils/dotize";
import {
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { EncodedActionCounts } from "talk-server/models/action";
import {
  Connection,
  createConnection,
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
  status: GQLCOMMENT_STATUS;
  assigned_by?: string;
  created_at: Date;
}

export interface Comment extends TenantResource {
  readonly id: string;
  parent_id?: string;
  author_id: string;
  story_id: string;
  body: string;
  body_history: BodyHistoryItem[];
  status: GQLCOMMENT_STATUS;
  status_history: StatusHistoryItem[];
  action_counts: EncodedActionCounts;
  grandparent_ids: string[];
  reply_ids: string[];
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
  | "reply_ids"
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
    reply_ids: [],
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

/**
 * pushChildCommentIDOntoParent will push the new child comment's ID onto the
 * parent comment so it can reference direct children.
 */
export async function pushChildCommentIDOntoParent(
  mongo: Db,
  tenantID: string,
  parentID: string,
  childID: string
) {
  // This pushes the new child ID onto the parent comment.
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenant_id: tenantID,
      id: parentID,
    },
    {
      $push: { reply_ids: childID },
      $inc: { reply_count: 1 },
    }
  );

  return result.value;
}

export type EditCommentInput = Pick<
  Comment,
  "id" | "author_id" | "body" | "status" | "metadata"
> & {
  /**
   * lastEditableCommentCreatedAt is the date that the last comment would have
   * been editable. It is generally derived from the tenant's
   * `editCommentWindowLength` property.
   */
  lastEditableCommentCreatedAt: Date;
};

export async function editComment(
  db: Db,
  tenantID: string,
  input: EditCommentInput
) {
  const EDITABLE_STATUSES = [
    GQLCOMMENT_STATUS.NONE,
    GQLCOMMENT_STATUS.PREMOD,
    GQLCOMMENT_STATUS.ACCEPTED,
  ];
  const createdAt = new Date();

  const {
    id,
    body,
    lastEditableCommentCreatedAt,
    status,
    author_id,
    metadata,
  } = input;

  // TODO: (wyattjoh) consider resetting the action counts if we're starting fresh with a new comment

  const result = await collection(db).findOneAndUpdate(
    {
      id,
      tenant_id: tenantID,
      author_id,
      status: {
        $in: EDITABLE_STATUSES,
      },
      deleted_at: null,
      created_at: {
        $gt: lastEditableCommentCreatedAt,
      },
    },
    {
      $set: {
        body,
        status,
        // Embed all the metadata properties, this may override the existing
        // metadata, but we won't replace metadata that has been recalculated.
        // TODO: (wyattjoh) consider if we want to replace the metadata for edited comments instead of supplementing it
        ...dotize({ metadata }),
      },
      $push: {
        body_history: {
          body,
          created_at: createdAt,
        },
        status_history: {
          type: status,
          created_at: createdAt,
        },
      },
    },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );
  if (!result.value) {
    // Try to get the comment.
    const comment = await retrieveComment(db, tenantID, id);
    if (!comment) {
      // TODO: (wyattjoh) return better error
      throw new Error("comment not found");
    }

    if (comment.author_id !== author_id) {
      // TODO: (wyattjoh) return better error
      throw new Error("comment author mismatch");
    }

    // Check to see if the comment had a status that was editable.
    if (!EDITABLE_STATUSES.includes(comment.status)) {
      // TODO: (wyattjoh) return better error
      throw new Error("comment status is not editable");
    }

    // Check to see if the edit window expired.
    if (comment.created_at <= lastEditableCommentCreatedAt) {
      // TODO: (wyattjoh) return better error
      throw new Error("edit window expired");
    }

    // TODO: (wyattjoh) return better error
    throw new Error("comment edit failed for an unexpected reason");
  }

  return result.value;
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
  input: Pick<ConnectionInput, "orderBy" | "after">
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
  storyID: string,
  parentID: string,
  input: ConnectionInput
) {
  // Create the query.
  const query = new Query(collection(db)).where({
    tenant_id: tenantID,
    story_id: storyID,
    parent_id: parentID,
  });

  // Return a connection for the comments query.
  return retrieveConnection(input, query);
}

/**
 * retrieveCommentParentsConnection will return a comment connection used to
 * represent the parents of a given comment.
 *
 * @param mongo the database connection to use when retrieving comments
 * @param tenantID the tenant id for where the comment exists
 * @param commentID the id of the comment to retrieve parents of
 * @param pagination pagination options to paginate the results
 */
export async function retrieveCommentParentsConnection(
  mongo: Db,
  tenantID: string,
  comment: Comment,
  { last: limit, before: skip = 0 }: { last: number; before?: number }
): Promise<Readonly<Connection<Readonly<Comment>>>> {
  // Return nothing if this comment does not have any parents.
  if (!comment.parent_id) {
    return createConnection({
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  }

  // TODO: (wyattjoh) maybe throw an error when the limit is zero?

  if (limit <= 0) {
    return createConnection({
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: !!comment.parent_id,
        endCursor: 0,
        startCursor: 0,
      },
    });
  }

  // If the last paramter is 1, and the after paramter is either unset or equal
  // to zero, then all we have to return is the direct parent.
  if (limit === 1 && skip <= 0) {
    const parent = await retrieveComment(mongo, tenantID, comment.parent_id);
    if (!parent) {
      throw new Error("parent comment not found");
    }

    return {
      edges: [{ node: parent, cursor: 1 }],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: comment.grandparent_ids.length > 0,
        endCursor: 1,
        startCursor: 1,
      },
    };
  }

  // Create a list of all the comment parent ids, in reverse order.
  const parentIDs = [comment.parent_id, ...comment.grandparent_ids.reverse()];

  // Fetch the subset of the comment id's that we are going to query for.
  const parentIDSubset = parentIDs.slice(skip, skip + limit);

  // Retrieve the parents via the subset list.
  const parents = await retrieveManyComments(mongo, tenantID, parentIDSubset);

  // Loop over the list to ensure that none of the entries is null (indicating
  // that there was a misplaced parent). We can assert the type here because we
  // will throw an error and abort if one of the comments are null.
  parents.forEach(parentComment => {
    if (!parentComment) {
      // TODO: (wyattjoh) replace with a better error.
      throw new Error("parent id specified does not exist");
    }

    return true;
  });

  const edges = nodesToEdges(
    // We can't have a null parent after the forEach filter above.
    parents as Array<Readonly<Comment>>,
    (_, index) => index + skip + 1
  ).reverse();

  // Return the resolved connection.
  return {
    edges,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: parentIDs.length > limit + skip,
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    },
  };
}

/**
 * retrieveStoryConnection returns a Connection<Comment> for a given Stories
 * comments.
 *
 * @param db database connection
 * @param storyID the Story id for the comment to retrieve
 * @param input connection configuration
 */
export async function retrieveCommentStoryConnection(
  db: Db,
  tenantID: string,
  storyID: string,
  input: ConnectionInput
) {
  // Create the query.
  const query = new Query(collection(db)).where({
    tenant_id: tenantID,
    story_id: storyID,
    parent_id: null,
  });

  // Return a connection for the comments query.
  return retrieveConnection(input, query);
}

/**
 * retrieveCommentUserConnection returns a Connection<Comment> for a given User's
 * comments.
 *
 * @param db database connection
 * @param userID the User id for the comment to retrieve
 * @param input connection configuration
 */
export async function retrieveCommentUserConnection(
  db: Db,
  tenantID: string,
  userID: string,
  input: ConnectionInput
) {
  // Create the query.
  const query = new Query(collection(db)).where({
    tenant_id: tenantID,
    author_id: userID,
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
      query.orderBy({ "action_counts.REACTION": -1, created_at: -1 });
      if (input.after) {
        query.after(input.after as number);
      }
      break;
  }
}

/**
 * updateCommentActionCounts will update the given comment's action counts.
 *
 * @param mongo the database handle
 * @param tenantID the id of the Tenant
 * @param id the id of the Comment being updated
 * @param actionCounts the action counts to merge into the Comment
 */
export async function updateCommentActionCounts(
  mongo: Db,
  tenantID: string,
  id: string,
  actionCounts: EncodedActionCounts
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenant_id: tenantID },
    // Update all the specific action counts that are associated with each of
    // the counts.
    { $inc: dotize({ action_counts: actionCounts }) },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value;
}

/**
 * removeStoryComments will remove all comments associated with a particular
 * Story.
 */
export async function removeStoryComments(
  mongo: Db,
  tenantID: string,
  storyID: string
) {
  // Delete all the comments written on a specific story.
  return collection(mongo).deleteMany({
    tenant_id: tenantID,
    story_id: storyID,
  });
}
