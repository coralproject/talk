import { ConnectionHandler, Environment, RecordProxy } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitLocalUpdatePromisified,
  createMutation,
} from "coral-framework/lib/relay";
import { ShowMoreRepliesEvent } from "coral-stream/events";

import { MarkCommentsAsSeenInput } from "coral-stream/__generated__/MarkCommentsAsSeenMutation.graphql";

import { incrementStoryCommentCounts } from "../helpers";

interface ReplyListViewNewMutationInput {
  storyID: string;
  commentID: string;

  viewerID?: string;
  markSeen: boolean;
  markAsSeen?: (
    input: Omit<MarkCommentsAsSeenInput, "clientMutationId"> & {
      updateSeen: boolean;
    }
  ) => Promise<
    Omit<
      {
        readonly comments: ReadonlyArray<{
          readonly id: string;
          readonly seen: boolean | null;
        }>;
        readonly clientMutationId: string;
      },
      "clientMutationId"
    >
  >;
}

const ReplyListViewNewMutation = createMutation(
  "viewNew",
  async (
    environment: Environment,
    {
      commentID,
      storyID,
      viewerID,
      markSeen,
      markAsSeen,
    }: ReplyListViewNewMutationInput,
    { eventEmitter }: CoralContext
  ) => {
    let commentIDs: string[] = [];
    const commentIDsAlreadySeen: string[] = [];

    await commitLocalUpdatePromisified(environment, async (store) => {
      const parentProxy = store.get(commentID);
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
      viewNewEdges.forEach((edge) => {
        ConnectionHandler.insertEdgeAfter(connection, edge);
        incrementStoryCommentCounts(store, storyID, edge);
        if (edge.getLinkedRecord("node")?.getValue("seen")) {
          commentIDsAlreadySeen.push(
            edge.getLinkedRecord("node")!.getValue("id") as string
          );
        }
      });

      commentIDs = viewNewEdges.map(
        (edge) => edge.getLinkedRecord("node")!.getValue("id") as string
      );

      connection.setLinkedRecords([], "viewNewEdges");
      ShowMoreRepliesEvent.emit(eventEmitter, {
        commentID,
        count: viewNewEdges.length,
      });
    });

    if (viewerID && markSeen && commentIDs.length > 0 && markAsSeen) {
      // Filter out any new reply edges that have already been marked as seen,
      // via mark all as read, for example
      commentIDs = commentIDs.filter(
        (id) => !commentIDsAlreadySeen.includes(id)
      );
      await markAsSeen({ storyID, commentIDs, updateSeen: false });
    }
  }
);

export default ReplyListViewNewMutation;
