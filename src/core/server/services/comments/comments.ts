import { DateTime } from "luxon";
import { Collection, Db } from "mongodb";

import { MongoContext } from "coral-server/data/context";
import { CommentNotFoundError } from "coral-server/errors";
import {
  addCommentTag,
  Comment,
  CommentConnectionInput,
  removeCommentTag,
  retrieveAllCommentsUserConnection as retrieveAllCommentsUserConnectionModel,
  retrieveComment as retrieveCommentModel,
  retrieveCommentConnection as retrieveCommentConnectionModel,
  retrieveCommentParentsConnection as retrieveCommentParentsConnectionModel,
  retrieveCommentRepliesConnection as retrieveCommentRepliesConnectionModel,
  retrieveCommentStoryConnection as retrieveCommentStoryConnectionModel,
  retrieveCommentUserConnection as retrieveCommentUserConnectionModel,
  retrieveManyComments as retrieveManyCommentModels,
  retrieveRejectedCommentUserConnection as retrieveRejectedCommentUserConnectionModel,
} from "coral-server/models/comment";
import { getLatestRevision } from "coral-server/models/comment/helpers";
import { Connection } from "coral-server/models/helpers";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";

import { GQLTAG } from "coral-server/graph/schema/__generated__/types";

import { archivedComments, comments } from "../mongodb/collections";

export function getCollection(
  mongo: MongoContext,
  isArchived?: boolean
): Collection<Readonly<Comment>> {
  const collection: Collection<Readonly<Comment>> =
    isArchived && mongo.archive
      ? archivedComments(mongo.archive)
      : comments(mongo.live);

  return collection;
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

export async function addTag(
  mongo: Db,
  tenant: Tenant,
  commentID: string,
  commentRevisionID: string,
  user: User,
  tagType: GQLTAG,
  now = new Date()
) {
  const comment = await retrieveCommentModel(
    comments(mongo),
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

export async function removeTag(
  mongo: Db,
  tenant: Tenant,
  commentID: string,
  tagType: GQLTAG
) {
  const comment = await retrieveComment(
    { live: mongo, archive: mongo },
    tenant.id,
    commentID,
    true
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

export async function retrieveComment(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  skipArchive?: boolean
) {
  const liveComment = await retrieveCommentModel(
    comments(mongo.live),
    tenantID,
    id
  );

  if (liveComment) {
    return liveComment;
  }

  if (mongo.archive && !skipArchive) {
    const archivedComment = await retrieveCommentModel(
      archivedComments(mongo.archive),
      tenantID,
      id
    );

    return archivedComment;
  }

  return null;
}

export async function retrieveManyComments(
  mongo: MongoContext,
  tenantID: string,
  ids: ReadonlyArray<string>
) {
  if (ids.length === 0) {
    return [];
  }

  const liveCollection = comments(mongo.live);
  const liveComments = await retrieveManyCommentModels(
    liveCollection,
    tenantID,
    ids
  );
  if (liveComments.length > 0) {
    return liveComments;
  }

  // Otherwise, try and find it in the archived comments collection
  if (mongo.archive) {
    const archivedCollection = archivedComments(mongo.archive);
    const archived = await retrieveManyCommentModels(
      archivedCollection,
      tenantID,
      ids
    );
    return archived;
  }

  return [];
}

export async function retrieveCommentConnection(
  mongo: MongoContext,
  tenantID: string,
  input: CommentConnectionInput,
  isArchived?: boolean
): Promise<Readonly<Connection<Readonly<Comment>>>> {
  const collection = getCollection(mongo, isArchived);
  return retrieveCommentConnectionModel(collection, tenantID, input);
}

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

export function retrieveRejectedCommentUserConnection(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  input: CommentConnectionInput
) {
  // Rejected comments always come from the live
  // and never from archived, we don't load mod queues
  // from the archive
  const collection = comments(mongo.live);
  return retrieveRejectedCommentUserConnectionModel(
    collection,
    tenantID,
    userID,
    input
  );
}

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

export function retrieveCommentParentsConnection(
  mongo: MongoContext,
  tenantID: string,
  comment: Comment,
  paginationParameters: { last: number; before?: number },
  isArchived?: boolean
) {
  const collection =
    isArchived && mongo.archive
      ? archivedComments(mongo.archive)
      : comments(mongo.live);
  return retrieveCommentParentsConnectionModel(
    collection,
    tenantID,
    comment,
    paginationParameters
  );
}
