import { ConnectionHandler, Environment, RecordProxy } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitLocalUpdatePromisified,
  createMutation,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLTAG } from "coral-framework/schema";
import { ViewNewCommentsEvent } from "coral-stream/events";

import { MarkCommentsAsSeenInput } from "coral-stream/__generated__/MarkCommentsAsSeenMutation.graphql";

import { incrementStoryCommentCounts } from "../../helpers";

interface Input {
  storyID: string;
  tag?: GQLTAG;

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

const AllCommentsTabViewNewMutation = createMutation(
  "viewNew",
  async (
    environment: Environment,
    { storyID, tag, markSeen, viewerID, markAsSeen }: Input,
    { eventEmitter }: CoralContext
  ) => {
    let commentIDs: string[] = [];
    const commentIDsAlreadySeen: string[] = [];

    await commitLocalUpdatePromisified(environment, async (store) => {
      const story = store.get(storyID)!;
      const connection = ConnectionHandler.getConnection(
        story,
        "Stream_comments",
        {
          orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
          tag,
        }
      )!;
      const viewNewEdges = connection.getLinkedRecords(
        "viewNewEdges"
      ) as ReadonlyArray<RecordProxy>;
      if (!viewNewEdges || viewNewEdges.length === 0) {
        return;
      }

      commentIDs = viewNewEdges.map(
        (edge) => edge.getLinkedRecord("node")!.getValue("id") as string
      );

      // Insert new edges into the view.
      viewNewEdges.forEach((edge) => {
        ConnectionHandler.insertEdgeBefore(connection, edge);
        incrementStoryCommentCounts(store, storyID, edge);
        if (edge.getLinkedRecord("node")?.getValue("seen")) {
          commentIDsAlreadySeen.push(
            edge.getLinkedRecord("node")!.getValue("id") as string
          );
        }
      });

      ViewNewCommentsEvent.emit(eventEmitter, {
        storyID,
        count: viewNewEdges.length,
      });
      connection.setLinkedRecords([], "viewNewEdges");
    });

    if (viewerID && markSeen && commentIDs.length > 0 && markAsSeen) {
      // Filter out any new comment edges that have already been marked as seen,
      // via mark all as read, for example
      commentIDs = commentIDs.filter(
        (id) => !commentIDsAlreadySeen.includes(id)
      );
      await markAsSeen({ storyID, commentIDs, updateSeen: false });
    }
  }
);

export default AllCommentsTabViewNewMutation;
