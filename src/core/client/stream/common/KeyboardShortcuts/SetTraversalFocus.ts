import { commitLocalUpdate, Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";
import {
  COMMIT_SEEN_EVENT,
  CommitSeenEventData,
} from "coral-stream/tabs/Comments/commentSeen/CommentSeenContext";

export interface Input {
  commentID: string;
  commentSeenEnabled: boolean;
  skipCommitSeen?: boolean;
}

export async function commit(
  environment: Environment,
  input: Input,
  context: CoralContext
) {
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
        if (!input.skipCommitSeen) {
          context.eventEmitter.emit(COMMIT_SEEN_EVENT, {
            commentID: input.commentID,
          } as CommitSeenEventData);
        }
      }
      localRecord.setValue(input.commentID, "commentWithTraversalFocus");
    }
  });
}

export const SetTraversalFocus = createMutation("SetTraversalFocus", commit);
