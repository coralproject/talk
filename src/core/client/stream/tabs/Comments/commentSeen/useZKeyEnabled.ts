import { useContext } from "react";
import { CommentSeenContext } from "./CommentSeenContext";

/**
 * Returns true when the comment seen feature is enabled.
 */
export default function useZKeyEnabled() {
  const { enabledZKey } = useContext(CommentSeenContext);
  return enabledZKey;
}
