import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { SectionFilter } from "coral-common/section";
import {
  GQLCOMMENT_SORT_RL,
  GQLMODERATION_QUEUE_RL,
} from "coral-framework/schema";

export default function getQueueConnection(
  store: RecordSourceSelectorProxy | RecordSourceProxy,
  queue: GQLMODERATION_QUEUE_RL | "REJECTED" | "APPROVED",
  storyID?: string | null,
  siteID?: string | null,
  orderBy?: GQLCOMMENT_SORT_RL | null,
  section?: SectionFilter | null
): RecordProxy | null | undefined {
  const root = store.getRoot();
  if (queue === "REJECTED") {
    return ConnectionHandler.getConnection(root, "RejectedQueue_comments");
  }
  if (queue === "APPROVED") {
    return ConnectionHandler.getConnection(root, "ApprovedQueue_comments");
  }
  const queuesRecord = root.getLinkedRecord("moderationQueues", {
    storyID,
    siteID,
    section,
  })!;
  if (!queuesRecord) {
    return undefined;
  }

  const queueRecord = queuesRecord.getLinkedRecord(queue.toLowerCase());
  if (!queueRecord) {
    return undefined;
  }

  return ConnectionHandler.getConnection(queueRecord, "Queue_comments", {
    orderBy,
  });
}
