import { graphql } from "react-relay";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS, GQLTAG } from "coral-framework/schema";

import { FeatureCommentMutation as MutationTypes } from "coral-stream/__generated__/FeatureCommentMutation.graphql";

let clientMutationId = 0;

function incrementCount(store: RecordSourceSelectorProxy, storyID: string) {
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
    tagsRecord.setValue(tagsRecord.getValue("FEATURED") + 1, "FEATURED");
  }
}

const FeatureCommentMutation = createMutation(
  "featureComment",
  (
    environment: Environment,
    input: MutationInput<MutationTypes> & { storyID: string },
    { uuidGenerator }: CoralContext
  ) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation FeatureCommentMutation($input: FeatureCommentInput!) {
          featureComment(input: $input) {
            comment {
              tags {
                code
              }
              status
            }
            clientMutationId
          }
        }
      `,
      optimisticUpdater: store => {
        const comment = store.get(input.commentID)!;
        const tags = comment.getLinkedRecords("tags");
        if (tags) {
          const newTag = store.create(uuidGenerator(), "Tag");
          newTag.setValue(GQLTAG.FEATURED, "code");
          comment.setLinkedRecords(tags.concat(newTag), "tags");
          comment.setValue(GQLCOMMENT_STATUS.APPROVED, "status");
        }
        incrementCount(store, input.storyID);
      },
      updater: store => {
        incrementCount(store, input.storyID);
      },
      variables: {
        input: {
          commentID: input.commentID,
          commentRevisionID: input.commentRevisionID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default FeatureCommentMutation;
