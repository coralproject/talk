import { graphql } from "react-relay";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLTAG } from "coral-framework/schema";
import { UnfeatureCommentEvent } from "coral-stream/events";

import { UnfeatureCommentMutation as MutationTypes } from "coral-stream/__generated__/UnfeatureCommentMutation.graphql";

let clientMutationId = 0;

function decrementCount(store: RecordSourceSelectorProxy, storyID: string) {
  const storyRecord = store.get(storyID);
  if (!storyRecord) {
    return;
  }
  const commentCountsRecord = storyRecord.getLinkedRecord("commentCounts");
  if (!commentCountsRecord) {
    return;
  }
  const tagsRecord = commentCountsRecord.getLinkedRecord("tags");
  if (tagsRecord) {
    tagsRecord.setValue(
      (tagsRecord.getValue("FEATURED") as number) - 1,
      "FEATURED"
    );
  }
}

const UnfeatureCommentMutation = createMutation(
  "unfeatureComment",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes> & { storyID: string },
    { eventEmitter }: CoralContext
  ) => {
    const unfeaturedCommentEvent = UnfeatureCommentEvent.begin(eventEmitter, {
      commentID: input.commentID,
    });
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation UnfeatureCommentMutation($input: UnfeatureCommentInput!) {
              unfeatureComment(input: $input) {
                comment {
                  tags {
                    code
                  }
                }
                clientMutationId
              }
            }
          `,
          optimisticUpdater: (store) => {
            const comment = store.get(input.commentID)!;
            const tags = comment.getLinkedRecords("tags")!;
            comment.setLinkedRecords(
              tags.filter((t) => t.getValue("code") === GQLTAG.FEATURED),
              "tags"
            );
            decrementCount(store, input.storyID);
          },
          updater: (store) => {
            decrementCount(store, input.storyID);
          },
          variables: {
            input: {
              commentID: input.commentID,
              clientMutationId: (clientMutationId++).toString(),
            },
          },
        }
      );
      unfeaturedCommentEvent.success();
      return result;
    } catch (error) {
      unfeaturedCommentEvent.error({
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }
);

export default UnfeatureCommentMutation;
