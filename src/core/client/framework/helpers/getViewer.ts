import { Environment } from "relay-runtime";
import { lookup } from "talk-framework/lib/relay";
import { GQLUser } from "talk-framework/schema";

import getViewerSourceID from "./getViewerSourceID";

export default function getViewer(environment: Environment) {
  const viewerID = getViewerSourceID(environment);
  if (!viewerID) {
    return null;
  }
  return lookup<GQLUser>(environment, viewerID)!;
}
