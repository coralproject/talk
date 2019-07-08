import { isEmpty, merge } from "lodash";
import { Db } from "mongodb";
import performanceNow from "performance-now";
import uuid from "uuid";

import { Omit, Sub } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import { CommentNotFoundError } from "coral-server/errors";
import {
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
  GQLCommentTagCounts,
  GQLTAG,
} from "coral-server/graph/tenant/schema/__generated__/types";
import logger from "coral-server/logger";
import {
  EncodedCommentActionCounts,
  mergeCommentActionCounts,
} from "coral-server/models/action/comment";
import {
  Connection,
  createConnection,
  doesNotContainNull,
  nodesToEdges,
  NodeToCursorTransformer,
  OrderedConnectionInput,
  resolveConnection,
} from "coral-server/models/helpers/connection";
import {
  createConnectionOrderVariants,
  createIndexFactory,
} from "coral-server/models/helpers/indexing";
import Query, { FilterQuery } from "coral-server/models/helpers/query";
import { TenantResource } from "coral-server/models/tenant";
import { VISIBLE_STATUSES } from "./constants";
import { hasAncestors } from "./helpers";
import { CommentTag } from "./tag";

export * from "./helpers";

function collection<T = Comment>(mongo: Db) {
  return mongo.collection<Readonly<T>>("comments");
}

/**
 * Revision stores a Comment's body for a specific edit. Actions can be tied to
 * a Revision, as can moderation actions.
 */
export interface Revision {
  /**
   * id identifies this Revision.
   */
  readonly id: string;

  /**
   * body is the body text for this revision.
   */
  body: string;

  /**
   * actionCounts is the cached action counts on this revision.
   */
  actionCounts: EncodedCommentActionCounts;

  /**
   * createdAt is the date that this revision was created at.
   */
  createdAt: Date;
}

/**
 * Comment's are created by User's on Stories. Each Comment contains a body, and
 * can be moderated by another Moderator or Admin User.
 */
export interface Comment extends TenantResource {
  /**
   * id identifies this Comment specifically.
   */
  readonly id: string;

  /**
   * ancestorIDs stores all the ancestor ID's, with the direct parent being
   * first.
   */
  ancestorIDs: string[];

  /**
   * parentID is the ID of the parent Comment if this Comment is a reply.
   */
  parentID?: string;

  /**
   * parentRevisionID is the ID of the Revision on the Comment referenced by the
   * `parentID`.
   */
  parentRevisionID?: string;

  /**
   * authorID stores the ID of the User that created this Comment.
   */
  authorID: string;

  /**
   * storyID stores the ID of the Story that this Comment was left on.
   */
  storyID: string;

  /**
   * revisions stores all the revisions of the Comment body including the most
   * recent revision, the last revision is the most recent.
   */
  revisions: Revision[];

  /**
   * status is the current Comment Status.
   */
  status: GQLCOMMENT_STATUS;

  /**
   * actionCounts stores a cached count of all the Action's against this
   * Comment.
   */
  actionCounts: EncodedCommentActionCounts;

  /**
   * childIDs are the ID's of all the Comment's that are direct replies.
   */
  childIDs: string[];

  /**
   * tags are CommentTag's on a specific Comment to be showcased with the
   * Comment.
   */
  tags: CommentTag[];

  /**
   * childCount is the count of direct replies. It is stored as a separate value
   * here even though the childIDs field technically contained the same data in
   * it's length because we needed to sort by this field sometimes.
   */
  childCount: number;

  /**
   * metadata stores the deep Comment properties.
   */
  metadata?: Record<string, any>;

  /**
   * createdAt is the date that this Comment was created.
   */
  createdAt: Date;

  /**
   * deletedAt is the date that this Comment was deleted on. If null or
   * undefined, this Comment is not deleted.
   */
  deletedAt?: Date;
}

export async function createCommentIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // Facility for counting the tags against a story.
  await createIndex(
    {
      tenantID: 1,
      storyID: 1,
      "tags.type": 1,
      status: 1,
    },
    {
      background: true,
      partialFilterExpression: {
        "tags.type": { $exists: true },
      },
    }
  );

  const variants = createConnectionOrderVariants<Readonly<Comment>>([
    { createdAt: -1 },
    { createdAt: 1 },
    { childCount: -1, createdAt: -1 },
    { "actionCounts.REACTION": -1, createdAt: -1 },
  ]);

  // Story based Comment Connection pagination.
  // { storyID, ...connectionParams }
  await variants(createIndex, {
    tenantID: 1,
    storyID: 1,
    status: 1,
  });

  // Story based Comment Connection pagination that are flagged.
  // { storyID, ...connectionParams }
  await variants(createIndex, {
    tenantID: 1,
    storyID: 1,
    status: 1,
    "actionCounts.FLAG": 1,
  });

  // Story + Reply based Comment Connection pagination.
  // { storyID, ...connectionParams }
  await variants(createIndex, {
    tenantID: 1,
    storyID: 1,
    parentID: 1,
    status: 1,
  });

  // Author based Comment Connection pagination.
  // { authorID, ...connectionParams }
  await variants(createIndex, {
    tenantID: 1,
    authorID: 1,
    status: 1,
  });

  // Tag based Comment Connection pagination.
  // { tags.type, ...connectionParams }
  await variants(createIndex, {
    tenantID: 1,
    "tags.type": 1,
  });
}

export type CreateCommentInput = Omit<
  Comment,
  | "id"
  | "tenantID"
  | "createdAt"
  | "childIDs"
  | "childCount"
  | "actionCounts"
  | "revisions"
  | "deletedAt"
> &
  Required<Pick<Revision, "body">> &
  Partial<Pick<Comment, "actionCounts">>;

export async function createComment(
  mongo: Db,
  tenantID: string,
  input: CreateCommentInput,
  now = new Date()
) {
  // Pull out some useful properties from the input.
  const { body, actionCounts = {}, ...rest } = input;

  // Generate the revision.
  const revision: Revision = {
    id: uuid.v4(),
    body,
    actionCounts,
    createdAt: now,
  };

  // default are the properties set by the application when a new comment is
  // created.
  const defaults: Sub<Comment, CreateCommentInput> = {
    id: uuid.v4(),
    tenantID,
    childIDs: [],
    childCount: 0,
    revisions: [revision],
    createdAt: now,
  };

  // Merge the defaults and the input together.
  const comment: Readonly<Comment> = {
    // Defaults for things that always stay the same, or are computed.
    ...defaults,
    // Rest for things that are passed in and are not actionCounts.
    ...rest,
    // ActionCounts because they may be passed in!
    actionCounts,
  };

  // Insert it into the database.
  await collection(mongo).insertOne(comment);

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
      tenantID,
      id: parentID,
    },
    {
      $push: { childIDs: childID },
      $inc: { childCount: 1 },
    }
  );

  return result.value;
}

export type EditCommentInput = Pick<
  Comment,
  "id" | "authorID" | "status" | "metadata"
> & {
  /**
   * lastEditableCommentCreatedAt is the date that the last comment would have
   * been editable. It is generally derived from the tenant's
   * `editCommentWindowLength` property.
   */
  lastEditableCommentCreatedAt: Date;
} & Required<Pick<Revision, "body">> &
  Partial<Pick<Comment, "actionCounts">>;

// Only comments with the following status's can be edited.
const EDITABLE_STATUSES = [
  GQLCOMMENT_STATUS.NONE,
  GQLCOMMENT_STATUS.PREMOD,
  GQLCOMMENT_STATUS.APPROVED,
];

export function validateEditable(
  comment: Comment,
  {
    authorID,
    lastEditableCommentCreatedAt,
  }: Pick<EditCommentInput, "authorID" | "lastEditableCommentCreatedAt">
) {
  if (comment.authorID !== authorID) {
    // TODO: (wyattjoh) return better error
    throw new Error("comment author mismatch");
  }

  // Check to see if the comment had a status that was editable.
  if (!EDITABLE_STATUSES.includes(comment.status)) {
    // TODO: (wyattjoh) return better error
    throw new Error("comment status is not editable");
  }

  // Check to see if the edit window expired.
  if (comment.createdAt <= lastEditableCommentCreatedAt) {
    // TODO: (wyattjoh) return better error
    throw new Error("edit window expired");
  }
}

export interface EditComment {
  /**
   * oldComment is the Comment that was previously set.
   */
  oldComment: Comment;

  /**
   * editedComment is the Comment after the edit was performed.
   */
  editedComment: Comment;

  /**
   * newRevision returns the new revision that was created in the Comment.
   */
  newRevision: Revision;
}

/**
 * editComment will edit a comment if it's within the time allotment.
 *
 * @param mongo MongoDB database handle
 * @param tenantID ID for the Tenant where the Comment exists
 * @param input input for editing the comment
 */
export async function editComment(
  mongo: Db,
  tenantID: string,
  input: EditCommentInput,
  now = new Date()
): Promise<EditComment> {
  const {
    id,
    body,
    lastEditableCommentCreatedAt,
    status,
    authorID,
    metadata,
    actionCounts = {},
  } = input;

  // Generate the revision.
  const revision: Revision = {
    id: uuid.v4(),
    body,
    actionCounts,
    createdAt: now,
  };

  const update: Record<string, any> = {
    $set: {
      status,
      // Embed all the metadata properties, this may override the existing
      // metadata, but we won't replace metadata that has been recalculated.
      // TODO: (wyattjoh) consider if we want to replace the metadata for edited comments instead of supplementing it
      ...dotize({ metadata }),
    },
    $push: {
      revisions: revision,
    },
  };
  if (!isEmpty(actionCounts)) {
    // Action counts are being provided! Increment the base action counts too!
    update.$inc = dotize({ actionCounts });
  }

  const result = await collection(mongo).findOneAndUpdate(
    {
      id,
      tenantID,
      authorID,
      status: {
        $in: EDITABLE_STATUSES,
      },
      deletedAt: null,
      createdAt: {
        $gt: lastEditableCommentCreatedAt,
      },
    },
    update,
    {
      // True to return the original document instead of the updated document.
      returnOriginal: true,
    }
  );
  if (!result.value) {
    // Try to get the comment.
    const comment = await retrieveComment(mongo, tenantID, id);
    if (!comment) {
      // TODO: (wyattjoh) return better error
      throw new Error("comment not found");
    }

    // Validate and potentially return with a more useful error.
    validateEditable(comment, input);

    // TODO: (wyattjoh) return better error
    throw new Error("comment edit failed for an unexpected reason");
  }

  // Create a new "editedComment" where the same changes were applied to it as
  // we did to the MongoDB document.
  const editedComment: Comment = merge({}, result.value, {
    // Add in all the $set operations.
    status,
    metadata,
    // Merge the actionCounts from the old Comment with the new actionCounts.
    actionCounts: mergeCommentActionCounts(
      result.value.actionCounts,
      actionCounts
    ),
    // Add in the $push operations.
    revisions: [...result.value.revisions, revision],
  });

  return {
    oldComment: result.value,
    editedComment,
    newRevision: revision,
  };
}

export async function retrieveComment(mongo: Db, tenantID: string, id: string) {
  return collection(mongo).findOne({ id, tenantID });
}

export async function retrieveManyComments(
  mongo: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = await collection(mongo).find({
    id: {
      $in: ids,
    },
    tenantID,
  });

  const comments = await cursor.toArray();

  return ids.map(id => comments.find(comment => comment.id === id) || null);
}

export type CommentConnectionInput = OrderedConnectionInput<
  Comment,
  GQLCOMMENT_SORT
>;

function cursorGetterFactory(
  input: Pick<CommentConnectionInput, "orderBy" | "after">
): NodeToCursorTransformer<Comment> {
  switch (input.orderBy) {
    case GQLCOMMENT_SORT.CREATED_AT_DESC:
    case GQLCOMMENT_SORT.CREATED_AT_ASC:
      return comment => comment.createdAt;
    case GQLCOMMENT_SORT.REPLIES_DESC:
    case GQLCOMMENT_SORT.REACTION_DESC:
      return (_, index) =>
        (input.after ? (input.after as number) : 0) + index + 1;
  }
}

/**
 * retrieveRepliesConnection returns a Connection<Comment> for a given comments
 * replies.
 *
 * @param mongo database connection
 * @param parentID the parent id for the comment to retrieve
 * @param input connection configuration
 */
export const retrieveCommentRepliesConnection = (
  mongo: Db,
  tenantID: string,
  storyID: string,
  parentID: string,
  input: CommentConnectionInput
) =>
  retrieveVisibleCommentConnection(mongo, tenantID, {
    ...input,
    filter: {
      ...input.filter,
      storyID,
      parentID,
    },
  });

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
  if (!hasAncestors(comment)) {
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
        hasPreviousPage: true,
        endCursor: 0,
        startCursor: 0,
      },
    });
  }

  // Fetch the subset of the comment id's that we are going to query for.
  const ancestorIDs = comment.ancestorIDs.slice(skip, skip + limit);

  // Retrieve the parents via the subset list.
  const nodes = await retrieveManyComments(mongo, tenantID, ancestorIDs);

  // Loop over the list to ensure that none of the entries is null (indicating
  // that there was a misplaced parent). We can assert the type here because we
  // will throw an error and abort if one of the comments are null.
  if (!doesNotContainNull(nodes)) {
    // TODO: (wyattjoh) replace with a better error.
    throw new Error("parent id specified does not exist");
  }

  const edges = nodesToEdges(
    // We can't have a null parent after the forEach filter above.
    nodes,
    (_, index) => index + skip + 1
  ).reverse();

  // Return the resolved connection.
  return {
    edges,
    nodes,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: comment.ancestorIDs.length > limit + skip,
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    },
  };
}

/**
 * retrieveStoryConnection returns a Connection<Comment> for a given Stories
 * comments.
 *
 * @param mongo database connection
 * @param storyID the Story id for the comment to retrieve
 * @param input connection configuration
 */
export const retrieveCommentStoryConnection = (
  mongo: Db,
  tenantID: string,
  storyID: string,
  input: CommentConnectionInput
) =>
  retrieveVisibleCommentConnection(mongo, tenantID, {
    ...input,
    filter: {
      ...input.filter,
      storyID,
    },
  });

/**
 * retrieveCommentUserConnection returns a Connection<Comment> for a given User's
 * comments.
 *
 * @param mongo database connection
 * @param tenantID the Tenant's ID
 * @param userID the User id for the comment to retrieve
 * @param input connection configuration
 */
export const retrieveCommentUserConnection = (
  mongo: Db,
  tenantID: string,
  userID: string,
  input: CommentConnectionInput
) =>
  retrieveVisibleCommentConnection(mongo, tenantID, {
    ...input,
    filter: {
      ...input.filter,
      authorID: userID,
    },
  });

/**
 * retrieveRejectedCommentUserConnection returns a Connection<Comment> for a given User's
 * rejected comments.
 *
 * @param mongo database connection
 * @param tenantID the Tenant's ID
 * @param userID the User id for the comment to retrieve
 * @param input connection configuration
 */
export const retrieveRejectedCommentUserConnection = (
  mongo: Db,
  tenantID: string,
  userID: string,
  input: CommentConnectionInput
) =>
  retrieveStatusCommentConnection(
    mongo,
    tenantID,
    [GQLCOMMENT_STATUS.REJECTED],
    {
      ...input,
      filter: {
        ...input.filter,
        authorID: userID,
      },
    }
  );

/**
 * retrieveVisibleCommentConnection will retrieve a connection that contains
 * comments that are visible.
 *
 * @param mongo database connection
 * @param tenantID the Tenant's ID
 * @param input connection configuration
 */
export const retrieveVisibleCommentConnection = (
  mongo: Db,
  tenantID: string,
  input: CommentConnectionInput
) => retrieveStatusCommentConnection(mongo, tenantID, VISIBLE_STATUSES, input);

/**
 * retrieveStatusCommentConnection will retrieve a connection that contains
 * comments with specific statuses.
 *
 * @param mongo database connection
 * @param tenantID the Tenant's ID
 * @param statuses the statuses to filter
 * @param input connection configuration
 */
export const retrieveStatusCommentConnection = (
  mongo: Db,
  tenantID: string,
  statuses: GQLCOMMENT_STATUS[],
  input: CommentConnectionInput
) =>
  retrieveCommentConnection(mongo, tenantID, {
    ...input,
    filter: {
      ...input.filter,
      status: { $in: statuses },
    },
  });

export async function retrieveCommentConnection(
  mongo: Db,
  tenantID: string,
  input: CommentConnectionInput
): Promise<Readonly<Connection<Readonly<Comment>>>> {
  // Create the query.
  const query = new Query(collection(mongo)).where({ tenantID });

  // If a filter is being applied, filter it as well.
  if (input.filter) {
    query.where(input.filter);
  }

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
  input: CommentConnectionInput,
  query: Query<Comment>
): Promise<Readonly<Connection<Readonly<Comment>>>> {
  // Apply some sorting options.
  applyInputToQuery(input, query);

  // Return a connection.
  return resolveConnection(query, input, cursorGetterFactory(input));
}

function applyInputToQuery(
  input: CommentConnectionInput,
  query: Query<Comment>
) {
  // NOTE: (wyattjoh) if we ever extend these, ensure that the new order variant is added as an index into the `createConnectionOrderVariants` function.
  switch (input.orderBy) {
    case GQLCOMMENT_SORT.CREATED_AT_DESC:
      query.orderBy({ createdAt: -1 });
      if (input.after) {
        query.where({ createdAt: { $lt: input.after as Date } });
      }
      break;
    case GQLCOMMENT_SORT.CREATED_AT_ASC:
      query.orderBy({ createdAt: 1 });
      if (input.after) {
        query.where({ createdAt: { $gt: input.after as Date } });
      }
      break;
    case GQLCOMMENT_SORT.REPLIES_DESC:
      query.orderBy({ childCount: -1, createdAt: -1 });
      if (input.after) {
        query.after(input.after as number);
      }
      break;
    case GQLCOMMENT_SORT.REACTION_DESC:
      query.orderBy({ "actionCounts.REACTION": -1, createdAt: -1 });
      if (input.after) {
        query.after(input.after as number);
      }
      break;
  }
}

export interface UpdateCommentStatus {
  /**
   * comment is the updated Comment with the new status associated with it.
   */
  comment: Readonly<Comment>;

  /**
   * oldStatus is the previous status that the given Comment had.
   */
  oldStatus: GQLCOMMENT_STATUS;
}

export async function updateCommentStatus(
  mongo: Db,
  tenantID: string,
  id: string,
  revisionID: string,
  status: GQLCOMMENT_STATUS
): Promise<UpdateCommentStatus | null> {
  const result = await collection(mongo).findOneAndUpdate(
    {
      id,
      tenantID,
      "revisions.id": revisionID,
      status: {
        $ne: status,
      },
    },
    {
      $set: { status },
    },
    {
      // True to return the original document instead of the updated
      // document.
      returnOriginal: true,
    }
  );
  if (!result.value) {
    return null;
  }

  // Grab the old status.
  const oldStatus = result.value.status;

  return {
    comment: {
      ...result.value,
      status,
    },
    oldStatus,
  };
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
  revisionID: string,
  actionCounts: EncodedCommentActionCounts
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    // Update all the specific action counts that are associated with each of
    // the counts.
    {
      $inc: dotize({
        actionCounts,
        "revisions.$[revision]": { actionCounts },
      }),
    },
    {
      // Add an ArrayFilter to only update one of the OpenID Connect
      // integrations.
      arrayFilters: [{ "revision.id": revisionID }],
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  return result.value || null;
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
    tenantID,
    storyID,
  });
}

/**
 * mergeManyCommentStories will update many comment's storyID's.
 */
export async function mergeManyCommentStories(
  mongo: Db,
  tenantID: string,
  newStoryID: string,
  oldStoryIDs: string[]
) {
  return collection(mongo).updateMany(
    {
      tenantID,
      storyID: {
        $in: oldStoryIDs,
      },
    },
    {
      $set: {
        storyID: newStoryID,
      },
    }
  );
}

export async function addCommentTag(
  mongo: Db,
  tenantID: string,
  commentID: string,
  tag: CommentTag
) {
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenantID,
      id: commentID,
      tags: {
        $not: {
          $eq: {
            type: tag.type,
          },
        },
      },
    },
    {
      $push: {
        tags: tag,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const comment = await retrieveComment(mongo, tenantID, commentID);
    if (!comment) {
      throw new CommentNotFoundError(commentID);
    }

    if (comment.tags.some(({ type }) => type === tag.type)) {
      return comment;
    }

    throw new Error("could not add a tag for an unexpected reason");
  }

  return result.value;
}

export async function removeCommentTag(
  mongo: Db,
  tenantID: string,
  commentID: string,
  tagType: GQLTAG
) {
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenantID,
      id: commentID,
    },
    {
      $pull: {
        tags: { type: tagType },
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const comment = await retrieveComment(mongo, tenantID, commentID);
    if (!comment) {
      throw new CommentNotFoundError(commentID);
    }

    throw new Error("could not add a tag for an unexpected reason");
  }

  return result.value;
}

export async function retrieveStoryCommentTagCounts(
  mongo: Db,
  tenantID: string,
  storyIDs: string[]
): Promise<GQLCommentTagCounts[]> {
  // Build up the $match query.
  const $match: FilterQuery<Comment> = {
    tenantID,
    // We're filtering only for featured comments for now because that's all
    // that is returned by the tag counts at the moment. If we ever extend this
    // we should switch this out to something like
    // `"tags.type": { $exists: true }` to ensure that we are using the
    // specified index.
    "tags.type": GQLTAG.FEATURED,
    // Only show visible comment's tag counts.
    status: { $in: VISIBLE_STATUSES },
  };
  if (storyIDs.length > 1) {
    $match.storyID = { $in: storyIDs };
  } else {
    $match.storyID = storyIDs[0];
  }

  // Get the start time.
  const startTime = performanceNow();

  // Load the counts from the database for this particular tag query.
  const cursor = await collection<{
    _id: { tag: GQLTAG; storyID: string };
    total: number;
  }>(mongo).aggregate([
    { $match },
    { $unwind: "$tags" },
    {
      $group: {
        _id: { tag: "$tags.type", storyID: "$storyID" },
        total: { $sum: 1 },
      },
    },
  ]);

  // Get all of the counts.
  const tags = await cursor.toArray();

  // Compute the end time.
  const responseTime = Math.round(performanceNow() - startTime);

  // Logging at the info level here to ensure we track any degrading performance
  // issues from this query.
  logger.info({ responseTime, filter: $match }, "counting tags");

  // For each of the storyIDs...
  return storyIDs.map(storyID => {
    // Get the tags associated with this storyID.
    const tagCounts = tags.filter(({ _id }) => _id.storyID === storyID) || [];

    // Then remap these tags to strip the storyID as the returned order already
    // preserves the storyID information.
    return tagCounts.reduce(
      (counts, { _id: { tag: code }, total }) => ({
        ...counts,
        [code]: total,
      }),
      // Keep this collection of empty tag counts up to date to ensure we
      // provide an accurate model. The type system should warn you if there is
      // missing/extra tags here.
      {
        [GQLTAG.FEATURED]: 0,
      }
    );
  });
}
