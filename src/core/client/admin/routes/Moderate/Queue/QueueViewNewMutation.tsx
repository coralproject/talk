import { ConnectionHandler, Environment } from "relay-runtime";

import { getQueueConnection } from "coral-admin/helpers";
import { SectionFilter } from "coral-common/section";
import {
  commitLocalUpdatePromisified,
  createMutation,
} from "coral-framework/lib/relay";
import { GQLMODERATION_QUEUE } from "coral-framework/schema";

interface QueueViewNewInput {
  storyID: string | null;
  siteID: string | null;
  section?: SectionFilter | null;
  queue: GQLMODERATION_QUEUE;
}

const QueueViewNewMutation = createMutation(
  "viewNew",
  async (environment: Environment, input: QueueViewNewInput) => {
    await commitLocalUpdatePromisified(environment, async (store) => {
      const connection = getQueueConnection(
        store,
        input.queue,
        input.storyID,
        input.siteID,
        input.section
      );
      if (!connection) {
        return;
      }
      const viewNewEdges = connection.getLinkedRecords("viewNewEdges");
      if (!viewNewEdges || viewNewEdges.length === 0) {
        return;
      }
      // If we have more than 20 new comments,
      // clear our list of comments and only show
      // the newest 20 comments. Infinite scrolling / loading
      // will deal with the rest. This is to prevent
      // having way too much comments to render on high
      // traffic environments.
      if (viewNewEdges.length > 20) {
        const edges = viewNewEdges.reverse().slice(0, 20);
        connection.setLinkedRecords(edges, "edges");
        connection.getLinkedRecord("pageInfo")!.setValue(true, "hasNextPage");
        connection
          .getLinkedRecord("pageInfo")!
          .setValue(edges[edges.length - 1].getValue("cursor"), "endCursor");
      } else {
        viewNewEdges.forEach((edge) => {
          ConnectionHandler.insertEdgeBefore(connection, edge);
        });
      }
      connection.setLinkedRecords([], "viewNewEdges");
    });
  }
);

export default QueueViewNewMutation;
