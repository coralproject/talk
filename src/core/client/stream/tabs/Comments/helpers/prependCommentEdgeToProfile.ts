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
  const meProxy = store.get(getViewerSourceID(environment)!)!;
  const con = ConnectionHandler.getConnection(
    meProxy,
    "CommentHistory_comments"
  );
  // Note: Currently this is always null, until Relay comes
  // with better data retaintion and data from store support.
  if (con) {
    ConnectionHandler.insertEdgeBefore(con, commentEdge);
  }
}
