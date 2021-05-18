import { ConnectionHandler, Environment, RecordProxy } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitLocalUpdatePromisified,
  createMutation,
} from "coral-framework/lib/relay";
import { ViewNewCommentsEvent } from "coral-stream/events";
import { GQLCOMMENT_SORT, GQLTAG } from "coral-stream/schema";

import { incrementStoryCommentCounts } from "../../helpers";

interface Input {
  storyID: string;
  tag?: GQLTAG;
}

const AllCommentsTabViewNewMutation = createMutation(
  "viewNew",
  async (
    environment: Environment,
    { storyID, tag }: Input,
    { eventEmitter }: CoralContext
  ) => {
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

      // Insert new edges into the view.
      viewNewEdges.forEach((edge) => {
        ConnectionHandler.insertEdgeBefore(connection, edge);
      });

      // Increment the count.
      incrementStoryCommentCounts(store, storyID, viewNewEdges.length);

      ViewNewCommentsEvent.emit(eventEmitter, {
        storyID,
        count: viewNewEdges.length,
      });
      connection.setLinkedRecords([], "viewNewEdges");
    });
  }
);

export default AllCommentsTabViewNewMutation;
