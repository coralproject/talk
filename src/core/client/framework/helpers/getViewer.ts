import { Environment } from "relay-runtime";

import { GQLUser } from "coral-common/schema";
import { lookup } from "coral-framework/lib/relay";

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
