import { DateTime } from "luxon";
import { Collection } from "mongodb";

import { MongoContext } from "coral-server/data/context";
import { CommentNotFoundError } from "coral-server/errors";
import {
  addCommentTag,
  Comment,
  CommentConnectionInput,
  removeCommentTag,
  retrieveAllCommentsUserConnection as retrieveAllCommentsUserConnectionModel,
  retrieveChildrenForParentConnection as retrieveChildrenForParentConnectionModel,
  retrieveComment as retrieveCommentModel,
  retrieveCommentConnection as retrieveCommentConnectionModel,
  retrieveCommentParentsConnection as retrieveCommentParentsConnectionModel,
  retrieveCommentRepliesConnection as retrieveCommentRepliesConnectionModel,
  retrieveCommentsBySitesUserConnection as retrieveCommentsBySitesUserConnectionModel,
  retrieveCommentStoryConnection as retrieveCommentStoryConnectionModel,
  retrieveCommentUserConnection as retrieveCommentUserConnectionModel,
  retrieveManyComments as retrieveManyCommentModels,
  retrieveRejectedCommentUserConnection as retrieveRejectedCommentUserConnectionModel,
} from "coral-server/models/comment";
import { getLatestRevision } from "coral-server/models/comment/helpers";
import { Connection } from "coral-server/models/helpers";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export function getCollection(
  mongo: MongoContext,
  isArchived?: boolean
): Collection<Readonly<Comment>> {
  return isArchived && mongo.archive
    ? mongo.archivedComments()
    : mongo.comments();
}

/**
 * getCommentEditableUntilDate will return the date that the given comment is
 * still editable until.
 *
 * @param tenant the tenant that contains settings related editing
 * @param createdAt the date that is the base, defaulting to the current time
 */
export function getCommentEditableUntilDate(
  tenant: Pick<Tenant, "editCommentWindowLength">,
  createdAt: Date
): Date {
  return DateTime.fromJSDate(createdAt)
    .plus({ seconds: tenant.editCommentWindowLength })
    .toJSDate();
}

/**
 * addTag will add a tag to the comment.
 *
 * @param mongo is the mongo context.
 * @param tenant is the filtering tenant for this operation.
 * @param commentID is the comment we are adding a tag to.
 * @param commentRevisionID is the revision of the comment we are tagging.
 * @param user is the user adding this tag.
 * @param tagType is the type of tag we are adding.
 * @param now is the time this tag was added.
 * @returns the modified comment with the newly added tag.
 */
export async function addTag(
  mongo: MongoContext,
  tenant: Tenant,
  commentID: string,
  commentRevisionID: string,
  user: User,
  tagType: GQLTAG,
  now = new Date()
) {
  const comment = await retrieveCommentModel(
    mongo.comments(),
    tenant.id,
    commentID
  );
  if (!comment) {
    throw new CommentNotFoundError(commentID);
  }

  // Check to see if the selected comment revision is the latest one.
  const revision = getLatestRevision(comment);
  if (revision.id !== commentRevisionID) {
    throw new Error("revision id does not match latest revision");
  }

  // Check to see if this tag is already on this comment.
  if (comment.tags.some(({ type }) => type === tagType)) {
    return comment;
  }

  return addCommentTag(mongo, tenant.id, commentID, {
    type: tagType,
    createdBy: user.id,
    createdAt: now,
  });
}

/**
 * removeTag will remove a specific tag type from a comment.
 *
 * @param mongo is the mongo context.
 * @param tenant is the filtering tenant for this operation.
 * @param commentID is the comment identifier we are removing the tag from.
 * @param tagType is the tag type to remove.
 * @returns the comment with the updated tag attributes.
 */
export async function removeTag(
  mongo: MongoContext,
  tenant: Tenant,
  commentID: string,
  tagType: GQLTAG
) {
  const comment = await retrieveCommentModel(
    mongo.comments(),
    tenant.id,
    commentID
  );
  if (!comment) {
    throw new CommentNotFoundError(commentID);
  }

  // Check to see if this tag is even on this comment.
  if (comment.tags.every(({ type }) => type !== tagType)) {
    return comment;
  }

  return removeCommentTag(mongo, tenant.id, commentID, tagType);
}

/**
 * retrieves a comment from the mongo context. If archiving is enabled and it
 * cannot find the comment within the live comments, it will try and find it in
 * the archived comments.
 *
 * @param mongo is the mongo context.
 * @param tenantID is the filtering tenant for this comment.
 * @param id is the identifier of the comment we want to retrieve.
 * @param skipArchive if set will not attempt to search the archive for the
 * comment if it can't find the comment in the live comments.
 * @returns the requested comment or null if not found.
 */
export async function retrieveComment(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  skipArchive?: boolean
) {
  const liveComment = await retrieveCommentModel(
    mongo.comments(),
    tenantID,
    id
  );

  if (liveComment) {
    return liveComment;
  }

  const archivedComments = mongo.archivedComments();
  if (mongo.archive && !skipArchive && archivedComments) {
    const archivedComment = await retrieveCommentModel(
      archivedComments,
      tenantID,
      id
    );

    return archivedComment;
  }

  return null;
}

/**
 * retrieves many comments from mongo. This will search both live and archived
 * comments if the archive database is available.
 *
 * @param mongo is the mongo context used to retrieve comments from.
 * @param tenantID is the filtering tenant for this comment set.
 * @param ids are the ids of the comments we want to retrieve.
 * @returns an array of comments.
 */
export async function retrieveManyComments(
  mongo: MongoContext,
  tenantID: string,
  ids: ReadonlyArray<string>
) {
  if (ids.length === 0) {
    return [];
  }

  const liveComments = await retrieveManyCommentModels(
    mongo.comments(),
    tenantID,
    ids
  );
  if (liveComments.length > 0 && liveComments.some((c) => c !== null)) {
    return liveComments;
  }

  // Otherwise, try and find it in the archived comments collection
  if (mongo.archive) {
    const archived = await retrieveManyCommentModels(
      mongo.archivedComments(),
      tenantID,
      ids
    );
    return archived;
  }

  return [];
}

/**
 * retrieves a comment connection for the provided input.
 *
 * @param mongo is the mongo context used to retrieve the comments.
 * @param tenantID is the filtering tenant id for this connection.
 * @param input is the filtered input to determine which comments to
 * include in the connection.
 * @param isArchived is whether this connection should retrieve from
 * the live or the archived comments databases.
 * @returns a connection of comments.
 */
export async function retrieveCommentConnection(
  mongo: MongoContext,
  tenantID: string,
  input: CommentConnectionInput,
  isArchived?: boolean
): Promise<Readonly<Connection<Readonly<Comment>>>> {
  const collection = getCollection(mongo, isArchived);
  return retrieveCommentConnectionModel(collection, tenantID, input);
}

/**
 * retrieves a comment connection for the provided input specific to a user.
 *
 * @param mongo is the mongo context used to retrieve the comments.
 * @param tenantID is the filtering tenant id for this connection.
 * @param input is the filtered input to determine which comments to
 * include in the connection.
 * @param isArchived is whether this connection should retrieve from
 * the live or the archived comments databases.
 * @returns a connection of comments.
 */
export function retrieveCommentUserConnection(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  input: CommentConnectionInput,
  isArchived?: boolean
) {
  const collection = getCollection(mongo, isArchived);
  return retrieveCommentUserConnectionModel(
    collection,
    tenantID,
    userID,
    input
  );
}

/**
 * retrieves a comment connection for all comments associated with a user.
 *
 * @param mongo is the mongo context used to retrieve the comments.
 * @param tenantID is the filtering tenant id for this connection.
 * @param userID is the filtering user id for this connection.
 * @param input is the filtered input to determine which comments to
 * include in the connection.
 * @param isArchived is whether this connection should retrieve from
 * the live or the archived comments databases.
 * @returns a connection of comments.
 */
export function retrieveAllCommentsUserConnection(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  input: CommentConnectionInput,
  isArchived?: boolean
) {
  const collection = getCollection(mongo, isArchived);
  return retrieveAllCommentsUserConnectionModel(
    collection,
    tenantID,
    userID,
    input
  );
}

/**
 * retrieveCommentsBySitesUserConnection retrieves a comment connection for
 * comments associated with a user filtered by site.
 *
 * @param mongo is the mongo context used to retrieve the comments.
 * @param tenantID is the filtering tenant id for this connection.
 * @param userID is the filtering user id for this connection.
 * @param siteIDs is the filtering siteIDs for this connection.
 * @param input is the filtered input to determine which comments to
 * include in the connection.
 * @param isArchived is whether this connection should retrieve from
 * the live or the archived comments databases.
 * @returns a connection of comments.
 */
export function retrieveCommentsBySitesUserConnection(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  siteIDs: string[],
  input: CommentConnectionInput,
  isArchived?: boolean
) {
  const collection = getCollection(mongo, isArchived);
  return retrieveCommentsBySitesUserConnectionModel(
    collection,
    tenantID,
    userID,
    siteIDs,
    input
  );
}

/**
 * retrieves a comment connection for the rejected comments of a user.
 *
 * @param mongo is the mongo context used to retrieve the comments.
 * @param tenantID is the filtering tenant id for this connection.
 * @param input is the filtered input to determine which comments to
 * include in the connection.
 * @param isArchived is whether this connection should retrieve from
 * the live or the archived comments databases.
 * @returns a connection of comments.
 */
export function retrieveRejectedCommentUserConnection(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  input: CommentConnectionInput
) {
  // Rejected comments always come from the live
  // and never from archived, we don't load mod queues
  // from the archive
  const collection = mongo.comments();
  return retrieveRejectedCommentUserConnectionModel(
    collection,
    tenantID,
    userID,
    input
  );
}

/**
 * retrieves a comment connection for a specific story.
 *
 * @param mongo is the mongo context used to retrieve the comments.
 * @param tenantID is the filtering tenant id for this connection.
 * @param storyID is the story we are retrieving comments for.
 * @param input is the filtered input to determine which comments to
 * include in the connection.
 * @param isArchived is whether this connection should retrieve from
 * the live or the archived comments databases.
 * @returns a connection of comments.
 */
export function retrieveCommentStoryConnection(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  input: CommentConnectionInput,
  isArchived?: boolean
) {
  const collection = getCollection(mongo, isArchived);
  return retrieveCommentStoryConnectionModel(
    collection,
    tenantID,
    storyID,
    input
  );
}

/**
 * retrieves a comment connection for the replies to a certain comment.
 *
 * @param mongo is the mongo context used to retrieve the comments.
 * @param tenantID is the filtering tenant id for this connection.
 * @param storyID is the story we are retrieving comments for.
 * @param parentID is the parent comment we are retrieving replies for.
 * @param input is the filtered input to determine which comments to
 * include in the connection.
 * @param isArchived is whether this connection should retrieve from
 * the live or the archived comments databases.
 * @returns a connection of comments.
 */
export function retrieveCommentRepliesConnection(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  parentID: string,
  input: CommentConnectionInput,
  isArchived?: boolean
) {
  const collection = getCollection(mongo, isArchived);
  return retrieveCommentRepliesConnectionModel(
    collection,
    tenantID,
    storyID,
    parentID,
    input
  );
}

/**
 * retrieves the parent comments for a comment.
 *
 * @param mongo is the mongo context we retrieve comments from.
 * @param tenantID is the filtering tenant for these comments.
 * @param comment is the comment we want to find parents for.
 * @param paginationParameters are the pagination sort/select options.
 * @param isArchived is whether this connection should retrieve from
 * the live or the archived comments databases.
 * @returns a connection of comments.
 */
export function retrieveCommentParentsConnection(
  mongo: MongoContext,
  tenantID: string,
  comment: Comment,
  paginationParameters: { last: number; before?: number },
  isArchived?: boolean
) {
  const collection =
    isArchived && mongo.archive ? mongo.archivedComments() : mongo.comments();
  return retrieveCommentParentsConnectionModel(
    collection,
    tenantID,
    comment,
    paginationParameters
  );
}

/**
 * retrieves all child comments for a comment.
 *
 * @param mongo is the mongo context we retrieve comments from.
 * @param tenantID is the filtering tenant for these comments.
 * @param comment is the comment we want to find all child comments for.
 * @param input is the filtered input to determine which comments to
 * include in the connection.
 * @param isArchived is whether this connection should retrieve from
 * the live or the archived comments databases.
 * @returns a connection of comments.
 */
export function retrieveChildrenForParentConnection(
  mongo: MongoContext,
  tenantID: string,
  comment: Comment,
  input: CommentConnectionInput,
  isArchived?: boolean
) {
  const collection =
    isArchived && mongo.archive ? mongo.archivedComments() : mongo.comments();
  return retrieveChildrenForParentConnectionModel(
    collection,
    tenantID,
    comment,
    input
  );
}

export async function hasRejectedAncestors(
  mongo: MongoContext,
  tenantID: string,
  commentID: string,
  isArchived = false
) {
  const comment = await retrieveComment(
    mongo,
    tenantID,
    commentID,
    !isArchived
  );
  if (!comment) {
    throw new CommentNotFoundError(commentID);
  }

  const { ancestorIDs } = comment;
  if (!ancestorIDs || ancestorIDs.length === 0) {
    return false;
  }

  const ancestors = await retrieveManyComments(mongo, tenantID, ancestorIDs);

  if (!ancestors || ancestors.length === 0) {
    return false;
  }

  const rejectedAncestors = ancestors.filter(
    (ancestor) => ancestor && ancestor.status === GQLCOMMENT_STATUS.REJECTED
  );
  const hasRejectedStateAncestors =
    rejectedAncestors && rejectedAncestors.length > 0;

  return hasRejectedStateAncestors;
}
