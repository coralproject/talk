import { RecordSourceSelectorProxy } from "relay-runtime";

import { GQLMODERATION_QUEUE } from "coral-framework/schema";

export default function changeQueueCount(
  store: RecordSourceSelectorProxy<unknown>,
  change: number,
  queue: GQLMODERATION_QUEUE,
  storyID: string | null = null
) {
  const moderationQueuesProxy = store
    .getRoot()
    .getLinkedRecord("moderationQueues", { storyID })!;
  if (!moderationQueuesProxy) {
    return;
  }
  const queueProxy = moderationQueuesProxy.getLinkedRecord(
    queue.toLocaleLowerCase()
  );
  if (!queueProxy) {
    return;
  }
  queueProxy.setValue(
    (queueProxy.getValue("count") as number) + change,
    "count"
  );
}
