import { useContext, useEffect } from "react";
import { CommentSeenContext } from "./CommentSeenContext";

export default function useCommentSeen(id: string) {
  const { enabled, seen, markSeen } = useContext(CommentSeenContext);
  // Mark everything as seen, when we couldn't acquire a seen map.
  const result = seen ? Boolean(seen[id]) : true;
  useEffect(() => {
    if (enabled && result === false) {
      markSeen(id);
    }
  }, [id, markSeen, result, enabled]);
  return result;
}
