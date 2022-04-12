import { useStreamLocal } from "coral-stream/local/StreamLocal";

export default function useAMP() {
  const { useAmp } = useStreamLocal();

  return useAmp;
}
