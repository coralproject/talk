import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import determineDepthTillAncestor from "coral-stream/tabs/shared/helpers/determineDepthTillAncestor";

import insertComment from "./insertComment";
import markHasNextPage from "./markHasNextPage";

export default function handleNewReplyInConversation(
  store: RecordSourceSelectorProxy<unknown>,
  ancestorID: string,
  comment: RecordProxy,
  options: {
    liveInsertion?: boolean;
  } = {}
) {
  const parent = comment.getLinkedRecord("parent");
  if (!parent) {
    return;
  }

  const pID = parent.getValue("id")! as string;
  // Wrong reply stream, bail out
  if (ancestorID !== pID) {
    return;
  }

  const depth = determineDepthTillAncestor(comment, ancestorID);
  if (depth && depth > 1) {
    return;
  }

  const afterConnection = ConnectionHandler.getConnection(
    parent,
    "Replies_after"
  );
  if (!afterConnection) {
    return;
  }

  const pageInfoAfter = afterConnection.getLinkedRecord("pageInfo")!;
  const hasNextPage = pageInfoAfter.getValue("hasNextPage")!;

  const beforeConnection = ConnectionHandler.getConnection(
    parent,
    "Replies_before"
  );

  if (options.liveInsertion) {
    if (!hasNextPage) {
      insertComment(store, comment, afterConnection);
    }
    return;
  }
  markHasNextPage(afterConnection, beforeConnection);
}
