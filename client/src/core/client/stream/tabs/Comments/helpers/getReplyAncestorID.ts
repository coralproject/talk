import { RecordProxy } from "relay-runtime";

/**
 * Find the ancestor id of the reply.
 *
 * @param comment RecordProxy of comment
 * @param depth Depth of comment as returned by `determineDepthTillAncestor`
 */
export default function getReplyAncestorID(
  comment: RecordProxy,
  depth: number
) {
  const iterations = depth;
  let cur: RecordProxy | null | undefined = comment;
  for (let i = 0; i < iterations; i++) {
    cur = cur.getLinkedRecord("parent");
  }
  return cur.getValue("id");
}
