import { useStreamLocal } from "coral-stream/local/StreamLocal";

/**
 * Returns true when the comment seen feature is enabled.
 */
export default function useZKeyEnabled() {
  const { enableCommentSeen, enableZKey } = useStreamLocal();

  return enableZKey && enableCommentSeen;
}
