import { Environment } from "relay-runtime";

import { lookup } from "coral-framework/lib/relay";
import { GQLUser } from "coral-framework/schema";

import getViewerSourceID from "./getViewerSourceID";

export default function getViewer<Viewer extends {} = GQLUser>(
  environment: Environment
) {
  const viewerID = getViewerSourceID(environment);
  if (!viewerID) {
    return null;
  }
  return lookup<Viewer>(environment, viewerID)!;
}
