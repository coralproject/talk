import { ConnectionHandler, Environment } from "relay-runtime";

import { getQueueConnection } from "coral-admin/helpers";
import {
  commitLocalUpdatePromisified,
  createMutation,
} from "coral-framework/lib/relay";
import { GQLMODERATION_QUEUE } from "coral-framework/schema";

interface QueueViewMoreInput {
  storyID: string | null;
  queue: GQLMODERATION_QUEUE;
}

const QueueViewMoreMutation = createMutation(
  "viewMore",
  async (environment: Environment, input: QueueViewMoreInput) => {
    await commitLocalUpdatePromisified(environment, async store => {
      const connection = getQueueConnection(store, input.queue, input.storyID);
      if (!connection) {
        return;
      }
      const viewMoreEdges = connection.getLinkedRecords("viewMoreEdges");
      if (!viewMoreEdges || viewMoreEdges.length === 0) {
        return;
      }
      viewMoreEdges.forEach(edge => {
        ConnectionHandler.insertEdgeBefore(connection, edge);
      });
      connection.setLinkedRecords([], "viewMoreEdges");
    });
  }
);

export default QueueViewMoreMutation;
