import { useRouter } from "found";
import { FunctionComponent, useEffect } from "react";

import {
  default as getModerationLink,
  Options,
} from "coral-framework/helpers/getModerationLink";

interface Props {
  mode: "PRE" | "POST" | "SPECIFIC_SITES_PRE" | "%future added value" | null;
  pathOptions: Omit<Options, "queue">;
}

const ModerationQueue: FunctionComponent<Props> = ({ mode, pathOptions }) => {
  const { router } = useRouter();
  useEffect(() => {
    if (mode) {
      router.replace(
        getModerationLink({
          queue: mode === "PRE" ? "pending" : "reported",
          ...pathOptions,
        })
      );
    }
  }, [mode, router, pathOptions]);
  return null;
};

export default ModerationQueue;
