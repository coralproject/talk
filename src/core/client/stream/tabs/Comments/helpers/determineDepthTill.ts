import { LOCAL_ID } from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import { MAX_REPLY_INDENT_DEPTH } from "coral-stream/constants";
import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

function isNodeIDInConnection(
  id: string,
  connection: RecordProxy<any>
): boolean {
  return connection
    .getLinkedRecords("edges")
    ?.some((edge) => edge.getLinkedRecord("node")?.getDataID() === id);
}

function isNodeIDInRepliesConnection(
  id: string,
  connection: RecordProxy<any>
): boolean {
  return connection
    .getLinkedRecords("edges")
    ?.concat(connection.getLinkedRecords("viewNewEdges") || [])
    .some((edge) => edge.getLinkedRecord("node")?.getDataID() === id);
}

function isCommentInsideParentRepliesConnection(comment: RecordProxy) {
  const parent = comment.getLinkedRecord("parent");
  if (!parent) {
    return false;
  }

  // Check if comment is inside parent replies connection
  const repliesConnection = ConnectionHandler.getConnection(
    parent,
    "ReplyList_replies",
    { orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC }
  )!;
  if (!repliesConnection) {
    return false;
  }
  return isNodeIDInRepliesConnection(comment.getDataID(), repliesConnection);
}

function findFlattenedParent(comment: RecordProxy, ancestorID?: string | null) {
  const maxDepth = MAX_REPLY_INDENT_DEPTH + 1; // +1 to include root level.
  const ancestors: RecordProxy[] = [];
  let cur = comment;
  while (cur) {
    ancestors.unshift(cur);
    if (cur.getDataID() === ancestorID) {
      break;
    }
    cur = cur.getLinkedRecord("parent");
  }
  if (ancestors.length > maxDepth) {
    return {
      flattendParent: ancestors[maxDepth - 1],
      exceededDepth: ancestors.length - maxDepth,
    };
  }
  return null;
}

/**
 * Returns depth until story or null if could not trace back to
 * comments that is loaded inside the stream!
 */
export function determineDepthTillStory(
  store: RecordSourceSelectorProxy<unknown>,
  comment: RecordProxy,
  storyID: string,
  orderBy: string,
  storyConnectionKey: string,
  tag?: string
) {
  const story = store.get(storyID)!;
  const storyConnection = ConnectionHandler.getConnection(
    story,
    storyConnectionKey,
    {
      orderBy,
      tag,
    }
  )!;

  // This is a top level comment and part of story, return 0;
  if (isNodeIDInConnection(comment.getDataID(), storyConnection)) {
    return 0;
  }

  const firstParent: RecordProxy | null | undefined =
    comment.getLinkedRecord("parent");
  // When first parent is null and it is not in the story connection: Return null;
  if (!firstParent) {
    return null;
  }

  // If flattenReplies start iterating from flattened Parent.
  const flattenReplies = store.get(LOCAL_ID)?.getValue("flattenReplies");
  const result = flattenReplies ? findFlattenedParent(comment) : null;
  let depth = result !== null ? result.exceededDepth : 1;
  let cur = result !== null ? result.flattendParent : firstParent;

  while (cur) {
    const parent: RecordProxy | null = cur.getLinkedRecord("parent");
    if (parent === null) {
      // Reaching a top level comment.
      if (!isNodeIDInConnection(cur.getDataID(), storyConnection)) {
        // Not in story, return null.
        return null;
      }
      // Return depth otherwise.
      return depth;
    } else if (isCommentInsideParentRepliesConnection(cur)) {
      // Current comment is inside the replies connection of the parent.
      depth++;
    } else {
      // Current comment is not in the replies connection of the parent.
      return null;
    }
    cur = parent;
  }
  return depth;
}
/**
 * Returns depth until ancestor or null if could not trace back to
 * comments that is loaded inside the stream!
 */
export function determineDepthTillAncestor(
  store: RecordSourceSelectorProxy<unknown>,
  comment: RecordProxy,
  ancestorID?: string | null
) {
  // Already ancestor, return 0;
  if (comment.getDataID() === ancestorID) {
    return 0;
  }
  const firstParent: RecordProxy | null | undefined =
    comment.getLinkedRecord("parent");
  if (!firstParent) {
    // It's a top level comment, so can't determine depth till ancestor.
    return null;
  }

  // Parent is ancestor, return 1.
  if (firstParent.getDataID() === ancestorID) {
    return 1;
  }

  // If flattenReplies start iterating from flattened Parent.
  const flattenReplies = store.get(LOCAL_ID)?.getValue("flattenReplies");
  const result = flattenReplies
    ? findFlattenedParent(comment, ancestorID)
    : null;
  let depth = result !== null ? result.exceededDepth : 1;
  let cur = result !== null ? result.flattendParent : firstParent;
  while (cur) {
    const parent: RecordProxy | null = cur.getLinkedRecord("parent");
    if (parent !== null) {
      if (!isCommentInsideParentRepliesConnection(cur)) {
        // Comment is not inside parents replies connection.
        return null;
      }
      depth++;
      if (parent.getDataID() === ancestorID) {
        // Reaching ancestor, return depth.
        return depth;
      }
    }
    cur = parent;
  }
  // Could not trace back to ancestor.
  return null;
}
