import { ConnectionHandler, Environment, RecordProxy } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitLocalUpdatePromisified,
  createMutation,
} from "coral-framework/lib/relay";
import { ViewNewCommentsEvent } from "coral-stream/events";
import { GQLCOMMENT_SORT, GQLTAG } from "coral-stream/schema";

interface Input {
  storyID: string;
}

const UnansweredCommentsTabViewNewMutation = createMutation(
  "viewNewUnanswered",
  async (
    environment: Environment,
    input: Input,
    { eventEmitter }: CoralContext
  ) => {
    await commitLocalUpdatePromisified(environment, async (store) => {
      const story = store.get(input.storyID)!;
      const connection = ConnectionHandler.getConnection(
        story,
        "UnansweredStream_comments",
        {
          orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
          tag: GQLTAG.UNANSWERED,
        }
      )!;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const viewNewEdges = connection.getLinkedRecords(
        "viewNewEdges"
      ) as ReadonlyArray<RecordProxy>;
      if (!viewNewEdges || viewNewEdges.length === 0) {
        return;
      }
      viewNewEdges.forEach((edge) => {
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

export default UnansweredCommentsTabViewNewMutation;
