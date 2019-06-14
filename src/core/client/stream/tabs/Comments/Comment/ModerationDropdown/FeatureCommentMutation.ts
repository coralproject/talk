import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLTAG } from "coral-framework/schema";
import { FeatureCommentMutation as MutationTypes } from "coral-stream/__generated__/FeatureCommentMutation.graphql";

let clientMutationId = 0;

const FeatureCommentMutation = createMutation(
  "featureComment",
  (
    environment: Environment,
    input: MutationInput<MutationTypes>,
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
            }
            clientMutationId
          }
        }
      `,
      optimisticUpdater: store => {
        const comment = store.get(input.commentID)!;
        const tags = comment.getLinkedRecords("tags")!;
        const newTag = store.create(uuidGenerator(), "Tag");
        newTag.setValue(GQLTAG.FEATURED, "code");
        comment.setLinkedRecords(tags.concat(newTag), "tags");
      },
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default FeatureCommentMutation;
