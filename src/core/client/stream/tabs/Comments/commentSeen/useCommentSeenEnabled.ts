import { useStreamLocal } from "coral-stream/local/StreamLocal";

/**
 * Returns true when the comment seen feature is enabled.
 */
export default function useCommentSeenEnabled() {
  const { enableCommentSeen } = useStreamLocal();

  return enableCommentSeen;
}
