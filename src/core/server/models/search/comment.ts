import { Elasticsearch } from "talk-server/services/elasticsearch";

import { Comment } from "../comment";
import { deleteDocument, indexDocument } from "./helpers";

/**
 * IndexedComment is a version of the Comment that is indexed in Elasticsearch.
 */
export type IndexedComment = Comment;

/**
 * buildIndexedCommentBody will convert a Comment into an IndexedComment.
 *
 * @param comment the comment to convert into an IndexedComment.
 */
export function buildIndexedCommentBody(comment: Comment): IndexedComment {
  return {
    tenantID: comment.tenantID,
    id: comment.id,
    parentID: comment.parentID,
    parentRevisionID: comment.parentRevisionID,
    authorID: comment.authorID,
    storyID: comment.storyID,
    revisions: comment.revisions,
    status: comment.status,
    actionCounts: comment.actionCounts,
    grandparentIDs: comment.grandparentIDs,
    replyIDs: comment.replyIDs,
    replyCount: comment.replyCount,
    metadata: comment.metadata,
    createdAt: comment.createdAt,
  };
}

/**
 * indexComment will index a given Comment in their IndexedComment form.
 *
 * @param elasticsearch the Elasticsearch client to use for indexing the Comment.
 * @param comment the Comment to index.
 */
export const indexComment = (elasticsearch: Elasticsearch, comment: Comment) =>
  indexDocument(elasticsearch, buildIndexedCommentBody(comment), "comments");

export const deleteIndexedComment = (
  elasticsearch: Elasticsearch,
  id: string
) => deleteDocument(elasticsearch, id, "comments");
