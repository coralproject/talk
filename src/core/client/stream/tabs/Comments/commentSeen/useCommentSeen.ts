import { useCallback, useContext, useEffect, useState } from "react";

import { CommentSeenContext } from "./CommentSeenContext";

/**
 * Returns boolean when the comment has been seen already.
 * Otherwise the comment with the `commentID` will be marked as
 * seen for the next refresh. Must be called within a `<CommentSeenProvider />`
 */
export default function useCommentSeen(
  commentID: string
): [boolean, () => void] {
  const { enabled, seen, markSeen, overrideAsSeen } = useContext(
    CommentSeenContext
  );
  const [overrideSeen, setOverrideSeen] = useState(false);
  // Mark everything as seen, when we couldn't acquire a seen map.
  const result = seen ? Boolean(seen[commentID]) : true;
  useEffect(() => {
    if (enabled && result === false) {
      markSeen(commentID);
    }
  }, [commentID, markSeen, result, enabled]);
  // Override so that we return that this comment has been seen.
  const override = useCallback(() => {
    // This takes effect immediately.
    setOverrideSeen(true);
    // This will preserve the override inside of the CommentSeenProvider.
    overrideAsSeen(commentID);
  }, [commentID, overrideAsSeen]);
  return [result || overrideSeen, override];
}
