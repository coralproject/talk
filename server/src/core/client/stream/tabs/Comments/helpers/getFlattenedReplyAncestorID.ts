import { RecordProxy } from "relay-runtime";

import { MAX_REPLY_INDENT_DEPTH } from "coral-stream/constants";

/**
 * Find the common ancestor id to flatten replies to.
 *
 * @param comment RecordProxy of comment
 * @param depth Depth of comment as returned by `determineDepthTillAncestor`
 */
export default function getFlattenedReplyAncestorID(
  comment: RecordProxy,
  depth: number
) {
  const iterations = depth - (MAX_REPLY_INDENT_DEPTH - 1);
  let cur: RecordProxy | null | undefined = comment;
  for (let i = 0; i < iterations; i++) {
    cur = cur.getLinkedRecord("parent");
  }
  return cur.getValue("id");
}
