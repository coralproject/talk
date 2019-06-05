import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { FeatureCommentMutation as MutationTypes } from "coral-stream/__generated__/FeatureCommentMutation.graphql";

let clientMutationId = 0;

const FeatureCommentMutation = createMutation(
  "featureComment",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation FeatureCommentMutation($input: FeatureCommentInput!) {
          featureComment(input: $input) {
            comment {
              tags {
                name
                code
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default FeatureCommentMutation;
