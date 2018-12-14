import { RecordProxy, RecordSourceSelectorProxy } from "relay-runtime";

type Queue = "reported" | "pending" | "unmoderated";

function setCount(
  queue: Queue,
  modqueuesProxy: RecordProxy,
  store: RecordSourceSelectorProxy
) {
  const root = store.getRoot();
  if (!root.getLinkedRecord("moderationQueues")) {
    return;
  }
  const count = modqueuesProxy.getLinkedRecord(queue)!.getValue("count")!;
  root
    .getLinkedRecord("moderationQueues")!
    .getLinkedRecord(queue)!
    .setValue(count, "count");
}

export default function getQueueConnection(
  modqueuesProxy: RecordProxy,
  store: RecordSourceSelectorProxy
) {
  setCount("pending", modqueuesProxy, store);
  setCount("reported", modqueuesProxy, store);
  setCount("unmoderated", modqueuesProxy, store);
}
