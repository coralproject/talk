import { RecordProxy } from "relay-runtime";

/**
 * Returns depth until ancestor or null if could not trace back to
 * comments that is loaded inside the stream!
 */
export default function determineDepthTillAncestor(
  comment: RecordProxy,
  ancestorID?: string | null
) {
  let depth = 0;
  let cur: RecordProxy | null | undefined = comment;
  while (cur) {
    // Check whether or not the parent already exists in our cache.
    cur = cur.getLinkedRecord("parent");
    // Because we request the parent including its id in subscription and mutations,
    // we can't just check for truthiness nor check the `id` field of the record to determine
    // that it already exists in our cache. Therefore we check for another field that
    // is part of the `CommentContainer_comment` fragment.
    if (cur?.getValue("createdAt")) {
      depth++;
      // Stop when reaching base ancestor.
      if (cur.getValue("id") === ancestorID) {
        return depth;
      }
    } else if (depth === 0) {
      return null;
    }
  }
  return depth;
}
