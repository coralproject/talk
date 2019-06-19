import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import {
  GQLCOMMENT_STATUS,
  GQLMODERATION_QUEUE_RL,
} from "coral-framework/schema";

export default function getQueueConnection(
  store: RecordSourceSelectorProxy | RecordSourceProxy,
  queue: GQLMODERATION_QUEUE_RL | "REJECTED",
  storyID?: string | null
): RecordProxy | null {
  const root = store.getRoot();
  if (queue === "REJECTED") {
    return ConnectionHandler.getConnection(root, "RejectedQueue_comments", {
      status: GQLCOMMENT_STATUS.REJECTED,
      storyID,
    });
  }
  const queuesRecord = root.getLinkedRecord("moderationQueues", { storyID })!;
  if (!queuesRecord) {
    return null;
  }
  return ConnectionHandler.getConnection(
    queuesRecord.getLinkedRecord(queue.toLowerCase()),
    "Queue_comments"
  );
}
