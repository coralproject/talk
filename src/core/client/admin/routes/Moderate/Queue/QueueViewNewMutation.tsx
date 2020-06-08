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
      viewNewEdges.forEach((edge) => {
        ConnectionHandler.insertEdgeBefore(connection, edge);
      });
      connection.setLinkedRecords([], "viewNewEdges");
    });
  }
);

export default QueueViewNewMutation;
