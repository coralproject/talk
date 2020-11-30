import {
  commitLocalUpdate,
  ConnectionHandler,
  Environment,
} from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation } from "coral-framework/lib/relay";

import { COMMENT_SORT } from "coral-stream/__generated__/RemoveAnsweredLocal.graphql";

export interface RemoveAnsweredMutationInput {
  commentID: string;
  storyID: string;
  orderBy: COMMENT_SORT;
}

export async function commit(
  environment: Environment,
  input: RemoveAnsweredMutationInput,
  context: CoralContext
) {
  return commitLocalUpdate(environment, (store) => {
    const storyRecord = store.get(input.storyID);
    const parentID = store
      .get(input.commentID)
      ?.getLinkedRecord("parent")
      ?.getValue("id") as string;

    if (!storyRecord || !parentID) {
      return;
    }

    const connection = ConnectionHandler.getConnection(
      storyRecord,
      "UnansweredStream_comments",
      {
        orderBy: input.orderBy,
        tag: "UNANSWERED",
      }
    );

    if (!connection) {
      return;
    }

    ConnectionHandler.deleteNode(connection, parentID);

    const commentCountsRecord = storyRecord.getLinkedRecord("commentCounts");
    if (!commentCountsRecord) {
      return;
    }

    const tagsRecord = commentCountsRecord.getLinkedRecord("tags");

    // increment answered questions and decrement unanswered questions
    if (tagsRecord) {
      tagsRecord.setValue(
        (tagsRecord.getValue("UNANSWERED") as number) - 1,
        "UNANSWERED"
      );
      tagsRecord.setValue(
        (tagsRecord.getValue("FEATURED") as number) + 1,
        "FEATURED"
      );
    }
  });
}

export const RemoveAnsweredMutation = createMutation("removeAnswered", commit);
