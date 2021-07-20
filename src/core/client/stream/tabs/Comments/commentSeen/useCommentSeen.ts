import { useContext, useEffect } from "react";
import { CommentSeenContext } from "./CommentSeenContext";

/**
 * Returns boolean when the comment has been seen already.
 * Otherwise the comment with the `commentID` will be marked as
 * seen for the next refresh. Must be called within a `<CommentSeenProvider />`
 */
export default function useCommentSeen(commentID: string) {
  const { enabled, seen, markSeen } = useContext(CommentSeenContext);
  // Mark everything as seen, when we couldn't acquire a seen map.
  const result = seen ? Boolean(seen[commentID]) : true;
  useEffect(() => {
    if (enabled && result === false) {
      markSeen(commentID);
    }
  }, [commentID, markSeen, result, enabled]);
  return result;
}
