import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import insertComment from "./insertComment";
import markHasNextPage from "./markHasNextPage";

export default function insertCommentToStory(
  store: RecordSourceSelectorProxy<unknown>,
  storyID: string,
  comment: RecordProxy,
  options: {
    liveInsertion?: boolean;
    fromMutation?: boolean;
  } = {}
) {
  const story = store.get(storyID)!;
  const afterConnection = ConnectionHandler.getConnection(story, "Chat_after");
  if (!afterConnection) {
    return;
  }
  const beforeConnection = ConnectionHandler.getConnection(
    story,
    "Chat_before"
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
