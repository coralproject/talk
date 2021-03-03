import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { GQLCOMMENT_SORT, GQLMODERATION_QUEUE } from "coral-admin/schema";
import { SectionFilter } from "coral-common/section";

export default function getQueueConnection(
  store: RecordSourceSelectorProxy | RecordSourceProxy,
  queue: GQLMODERATION_QUEUE | "REJECTED" | "APPROVED",
  storyID?: string | null,
  siteID?: string | null,
  orderBy?: GQLCOMMENT_SORT | null,
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
