import { ConnectionHandler, RecordSourceSelectorProxy } from "relay-runtime";

type Queue = "reported" | "pending" | "unmoderated" | "rejected";

export default function getQueueConnection(
  queue: Queue,
  store: RecordSourceSelectorProxy
) {
  const root = store.getRoot();
  if (queue === "rejected") {
    return ConnectionHandler.getConnection(root, "RejectedQueue_comments", {
      filter: { status: "REJECTED" },
    });
  }
  const queuesRecord = root.getLinkedRecord("moderationQueues")!;
  if (!queuesRecord) {
    return null;
  }
  return ConnectionHandler.getConnection(
    queuesRecord.getLinkedRecord(queue),
    "Queue_comments"
  );
}
