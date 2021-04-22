import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

export default function insertComment(
  store: RecordSourceSelectorProxy<unknown>,
  comment: RecordProxy,
  afterConnection: RecordProxy
) {
  const edge = ConnectionHandler.createEdge(store, comment, comment, "");
  edge.setValue(comment.getValue("createdAt"), "cursor");

  ConnectionHandler.insertEdgeAfter(afterConnection, edge);
}
