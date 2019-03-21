import { Environment } from "relay-runtime";

import getViewerSourceID from "./getViewerSourceID";

export default function getMe(environment: Environment) {
  const source = environment.getStore().getSource();
  const viewerID = getViewerSourceID(environment);
  if (!viewerID) {
    return null;
  }
  return source.get(viewerID)!;
}
