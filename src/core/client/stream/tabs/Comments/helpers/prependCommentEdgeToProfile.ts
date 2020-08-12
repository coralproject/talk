import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { getViewerSourceID } from "coral-framework/helpers";

export default function prependCommentEdgeToProfile(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  commentEdge: RecordProxy
) {
  const viewerID = getViewerSourceID(environment);
  if (!viewerID) {
    return;
  }

  const proxy = store.get(viewerID);
  if (!proxy) {
    return;
  }

  const con = ConnectionHandler.getConnection(proxy, "CommentHistory_comments");
  if (!con) {
    return;
  }

  ConnectionHandler.insertEdgeBefore(con, commentEdge);
}
