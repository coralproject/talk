import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";

export interface Input {
  commentID: string;
  commentSeenEnabled: boolean;
}

export async function commit(environment: Environment, input: Input) {
  return commitLocalUpdate(environment, (store) => {
    const localRecord = store.get(LOCAL_ID);
    if (!localRecord) {
      return;
    }
    const curCommentID = localRecord.getValue("commentWithTraversalFocus") as
      | string
      | undefined;
    if (curCommentID === input.commentID) {
      return;
    }
    if (input.commentSeenEnabled) {
      if (curCommentID) {
        const curComment = store.get(curCommentID);
        if (curComment) {
          curComment.setValue(false, "hasTraversalFocus");
        }
      }
    }

    const nextComment = store.get(input.commentID);
    if (nextComment) {
      if (input.commentSeenEnabled) {
        nextComment.setValue(true, "hasTraversalFocus");
      }
      localRecord.setValue(input.commentID, "commentWithTraversalFocus");
    }
  });
}

export const SetTraversalFocus = createMutation("SetTraversalFocus", commit);
