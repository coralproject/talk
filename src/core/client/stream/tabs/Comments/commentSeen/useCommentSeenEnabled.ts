import { useContext } from "react";
import { CommentSeenContext } from "./CommentSeenContext";

/**
 * Returns true when the comment seen feature is enabled.
 */
export default function useCommentSeenEnabled() {
  const { enabled } = useContext(CommentSeenContext);
  return enabled;
}
