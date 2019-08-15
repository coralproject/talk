import { ConnectionHandler, Environment, RecordProxy } from "relay-runtime";

import {
  commitLocalUpdatePromisified,
  createMutation,
} from "coral-framework/lib/relay";

interface ReplyListViewNewInput {
  commentID: string;
}

const QueueViewNewMutation = createMutation(
  "viewNew",
  async (environment: Environment, input: ReplyListViewNewInput) => {
    await commitLocalUpdatePromisified(environment, async store => {
      const parentProxy = store.get(input.commentID);
      if (!parentProxy) {
        return;
      }
      const connectionKey = "ReplyList_replies";
      const filters = { orderBy: "CREATED_AT_ASC" };
      const connection = ConnectionHandler.getConnection(
        parentProxy,
        connectionKey,
        filters
      );
      if (!connection) {
        return;
      }
      const viewNewEdges = connection.getLinkedRecords(
        "viewNewEdges"
      ) as RecordProxy[];
      if (!viewNewEdges || viewNewEdges.length === 0) {
        return;
      }
      viewNewEdges.forEach(edge => {
        ConnectionHandler.insertEdgeAfter(connection, edge);
      });
      connection.setLinkedRecords([], "viewNewEdges");
    });
  }
);

export default QueueViewNewMutation;
