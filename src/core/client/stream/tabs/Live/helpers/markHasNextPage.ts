import { RecordProxy } from "relay-runtime";

export default function markHasNextPage(
  afterConnection: RecordProxy,
  beforeConnection: RecordProxy | null | undefined
) {
  const pageInfoAfter = afterConnection.getLinkedRecord("pageInfo")!;
  // Should not be falsy because Relay uses this information to determine
  // whether or not new data is available to load.
  if (!pageInfoAfter.getValue("endCursor")) {
    const beforeEdges = beforeConnection
      ? beforeConnection.getLinkedRecords("edges")!
      : [];
    const endCursor =
      beforeEdges.length > 0
        ? beforeEdges[0].getValue("cursor")
        : new Date(0).toISOString();
    // Set cursor to oldest date, to load from the beginning.
    pageInfoAfter.setValue(endCursor, "endCursor");
  }
  pageInfoAfter.setValue(true, "hasNextPage");
}
