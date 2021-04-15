import { ConnectionHandler, RecordSourceProxy } from "relay-runtime";

export default function removeLiveChatComment(
  store: RecordSourceProxy,
  commentID: string,
  storyID: string,
  ancestorID?: string
) {
  const storyRecord = store.get(storyID)!;
  const chatAfter = ConnectionHandler.getConnection(storyRecord, "Chat_after");
  if (chatAfter) {
    ConnectionHandler.deleteNode(chatAfter, commentID);
  }
  const chatBefore = ConnectionHandler.getConnection(
    storyRecord,
    "Chat_before"
  );
  if (chatBefore) {
    ConnectionHandler.deleteNode(chatBefore, commentID);
  }
  if (ancestorID) {
    const ancestorRecord = store.get(ancestorID)!;
    const repliesAfter = ConnectionHandler.getConnection(
      ancestorRecord,
      "Replies_after"
    );
    if (repliesAfter) {
      ConnectionHandler.deleteNode(repliesAfter, commentID);
    }
    const repliesBefore = ConnectionHandler.getConnection(
      ancestorRecord,
      "Replies_before"
    );
    if (repliesBefore) {
      ConnectionHandler.deleteNode(repliesBefore, commentID);
    }
  }
}
