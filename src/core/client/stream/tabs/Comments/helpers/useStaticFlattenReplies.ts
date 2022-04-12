import { useStreamLocal } from "coral-stream/local/StreamLocal";

export default function useStaticFlattenReplies() {
  const { flattenReplies } = useStreamLocal();
  return flattenReplies;
}
