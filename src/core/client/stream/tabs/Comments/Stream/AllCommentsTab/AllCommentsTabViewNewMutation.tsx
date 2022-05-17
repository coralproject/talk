import { ConnectionHandler, Environment, RecordProxy } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitLocalUpdatePromisified,
  createMutation,
  LOCAL_ID,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLTAG } from "coral-framework/schema";
import { ViewNewCommentsEvent } from "coral-stream/events";

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
        incrementStoryCommentCounts(store, storyID, edge);
      });

      const local = store.get(LOCAL_ID);
      if (local) {
        local.setValue(null, "viewNewCount");
      }

      ViewNewCommentsEvent.emit(eventEmitter, {
        storyID,
        count: viewNewEdges.length,
      });
      connection.setLinkedRecords([], "viewNewEdges");
    });
  }
);

export default AllCommentsTabViewNewMutation;
