import { ConnectionHandler, RecordSourceSelectorProxy } from "relay-runtime";

type Queue = "reported" | "pending" | "unmoderated" | "rejected";

export default function getQueueConnection(
  store: RecordSourceSelectorProxy,
  queue: Queue,
  storyID?: string
) {
  const root = store.getRoot();
  if (queue === "rejected") {
    return ConnectionHandler.getConnection(root, "RejectedQueue_comments", {
      status: "REJECTED",
      storyID,
    });
  }
  const queuesRecord = root.getLinkedRecord("moderationQueues", { storyID })!;
  if (!queuesRecord) {
    return null;
  }
  return ConnectionHandler.getConnection(
    queuesRecord.getLinkedRecord(queue),
    "Queue_comments"
  );
}
