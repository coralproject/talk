import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import insertComment from "./insertComment";
import markHasNextPage from "./markHasNextPage";

export default function handleNewCommentInStory(
  store: RecordSourceSelectorProxy<unknown>,
  storyID: string,
  comment: RecordProxy,
  options: {
    liveInsertion?: boolean;
  } = {}
) {
  const story = store.get(storyID)!;
  const afterConnection = ConnectionHandler.getConnection(story, "Chat_after");
  if (!afterConnection) {
    return;
  }
  const pageInfoAfter = afterConnection.getLinkedRecord("pageInfo")!;
  const hasNextPage = pageInfoAfter.getValue("hasNextPage")!;

  const beforeConnection = ConnectionHandler.getConnection(
    story,
    "Chat_before"
  );
  if (options.liveInsertion) {
    if (!hasNextPage) {
      insertComment(store, comment, afterConnection);
    }
    return;
  }
  if (!hasNextPage) {
    markHasNextPage(afterConnection, beforeConnection);
  }
}
