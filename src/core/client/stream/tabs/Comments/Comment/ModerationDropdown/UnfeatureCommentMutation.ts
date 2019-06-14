import { graphql } from "react-relay";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLTAG } from "coral-framework/schema";
import { UnfeatureCommentMutation as MutationTypes } from "coral-stream/__generated__/UnfeatureCommentMutation.graphql";

let clientMutationId = 0;

function decrementCount(store: RecordSourceSelectorProxy, storyID: string) {
  const tagsRecord = store
    .get(storyID)!
    .getLinkedRecord("commentCounts")!
    .getLinkedRecord("tags")!;
  tagsRecord.setValue(tagsRecord.getValue("FEATURED") - 1, "FEATURED");
}

const UnfeatureCommentMutation = createMutation(
  "unfeatureComment",
  (
    environment: Environment,
    input: MutationInput<MutationTypes> & { storyID: string }
  ) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
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
      optimisticUpdater: store => {
        const comment = store.get(input.commentID)!;
        const tags = comment.getLinkedRecords("tags")!;
        comment.setLinkedRecords(
          tags.filter(t => t!.getValue("code") === GQLTAG.FEATURED),
          "tags"
        );
        decrementCount(store, input.storyID);
      },
      updater: store => {
        decrementCount(store, input.storyID);
      },
      variables: {
        input: {
          commentID: input.commentID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default UnfeatureCommentMutation;
