import { ConnectionHandler, Environment, RecordProxy } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitLocalUpdatePromisified,
  createMutation,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import { ViewNewCommentsEvent } from "coral-stream/events";

interface Input {
  storyID: string;
}

const AllCommentsTabViewNewMutation = createMutation(
  "viewNew",
  async (
    environment: Environment,
    input: Input,
    { eventEmitter }: CoralContext
  ) => {
    await commitLocalUpdatePromisified(environment, async store => {
      const story = store.get(input.storyID)!;
      const connection = ConnectionHandler.getConnection(
        story,
        "Stream_comments",
        {
          orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
        }
      )!;
      const viewNewEdges = connection.getLinkedRecords(
        "viewNewEdges"
      ) as ReadonlyArray<RecordProxy>;
      if (!viewNewEdges || viewNewEdges.length === 0) {
        return;
      }
      viewNewEdges.forEach(edge => {
        ConnectionHandler.insertEdgeBefore(connection, edge);
      });
      ViewNewCommentsEvent.emit(eventEmitter, {
        storyID: input.storyID,
        count: viewNewEdges.length,
      });
      connection.setLinkedRecords([], "viewNewEdges");
    });
  }
);

export default AllCommentsTabViewNewMutation;
