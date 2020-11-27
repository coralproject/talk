import { useRouter } from "found";
import { FunctionComponent, useEffect } from "react";

interface Props {
  mode: "PRE" | "POST" | "%future added value" | null;
}

const ModerationQueue: FunctionComponent<Props> = ({ mode }) => {
  const { router } = useRouter();
  useEffect(() => {
    if (mode === "PRE") {
      router.replace("/admin/moderate/pending");
    } else if (mode === "POST") {
      router.replace("/admin/moderate/reported");
    }
  }, [mode, router]);
  return null;
};

export default ModerationQueue;
