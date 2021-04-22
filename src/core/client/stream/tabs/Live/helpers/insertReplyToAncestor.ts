import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import determineDepthTillAncestor from "coral-stream/tabs/shared/helpers/determineDepthTillAncestor";

import insertComment from "./insertComment";
import markHasNextPage from "./markHasNextPage";

export default function insertReplyToAncestor(
  store: RecordSourceSelectorProxy<unknown>,
  ancestorID: string,
  comment: RecordProxy,
  options: {
    liveInsertion?: boolean;
    fromMutation?: boolean;
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

  const beforeConnection = ConnectionHandler.getConnection(
    parent,
    "Replies_before"
  );

  if (options.liveInsertion) {
    insertComment(store, comment, afterConnection);
  } else {
    markHasNextPage(
      afterConnection,
      beforeConnection,
      Boolean(options.fromMutation)
    );
  }
}
