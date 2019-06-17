import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { FeatureCommentMutation } from "coral-admin/__generated__/FeatureCommentMutation.graphql";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS, GQLTAG } from "coral-framework/schema";

let clientMutationId = 0;

const FeatureCommentMutation = createMutation(
  "featureComment",
  (
    environment: Environment,
    input: MutationInput<FeatureCommentMutation> & { storyID: string },
    { uuidGenerator }: CoralContext
  ) =>
    commitMutationPromiseNormalized<FeatureCommentMutation>(environment, {
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
