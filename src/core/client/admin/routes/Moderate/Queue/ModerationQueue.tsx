import { useRouter } from "found";
import { FunctionComponent, useEffect } from "react";

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
    let path = null;
    let suffix = "";

    if (mode === "PRE") {
      path = "pending";
    } else if (mode === "POST") {
      path = "reported";
    }

    if (siteID) {
      suffix = `/sites/${siteID}`;
    } else if (storyID) {
      suffix = `/stories/${storyID}`;
    }

    if (path) {
      router.replace(`/admin/moderate/${path}${suffix}`);
    }
  }, [mode, router, siteID, storyID]);
  return null;
};

export default ModerationQueue;
