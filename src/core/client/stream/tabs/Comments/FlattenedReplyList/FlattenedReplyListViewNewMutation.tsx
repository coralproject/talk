import { ConnectionHandler, Environment, RecordProxy } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitLocalUpdatePromisified,
  createMutation,
} from "coral-framework/lib/relay";
import { ShowMoreRepliesEvent } from "coral-stream/events";
import { incrementStoryCommentCounts } from "../helpers";

interface FlattenedReplyListViewNewMutationInput {
  storyID: string;
  commentID: string;
}

const FlattenedReplyListViewNewMutation = createMutation(
  "viewNew",
  async (
    environment: Environment,
    input: FlattenedReplyListViewNewMutationInput,
    { eventEmitter }: CoralContext
  ) => {
    await commitLocalUpdatePromisified(environment, async (store) => {
      const parentProxy = store.get(input.commentID);
      if (!parentProxy) {
        return;
      }
      const connectionKey = "FlattenedReplyListContainer_replies";
      const filters = { flatten: true, orderBy: "CREATED_AT_ASC" };
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
      viewNewEdges.forEach((edge) => {
        ConnectionHandler.insertEdgeAfter(connection, edge);
      });

      // Increment the count.
      incrementStoryCommentCounts(store, input.storyID, viewNewEdges.length);

      connection.setLinkedRecords([], "viewNewEdges");
      ShowMoreRepliesEvent.emit(eventEmitter, {
        commentID: input.commentID,
        count: viewNewEdges.length,
      });
    });
  }
);

export default FlattenedReplyListViewNewMutation;
