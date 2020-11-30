import { useRouter } from "found";
import { FunctionComponent, useEffect } from "react";

import { getModerationLink } from "coral-framework/helpers";

interface Props {
  mode: "PRE" | "POST" | "%future added value" | null;
  siteID?: string;
  storyID?: string;
}

const ModerationQueue: FunctionComponent<Props> = ({
  mode,
  siteID,
  storyID,
}) => {
  const { router } = useRouter();
  useEffect(() => {
    if (mode) {
      router.replace(
        getModerationLink({
          queue: mode === "PRE" ? "pending" : "reported",
          storyID,
          siteID,
        })
      );
    }
  }, [mode, router, siteID, storyID]);
  return null;
};

export default ModerationQueue;
