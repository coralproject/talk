import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { UnfeatureCommentMutation as MutationTypes } from "coral-stream/__generated__/UnfeatureCommentMutation.graphql";

let clientMutationId = 0;

const UnfeatureCommentMutation = createMutation(
  "unfeatureComment",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UnfeatureCommentMutation($input: UnfeatureCommentInput!) {
          unfeatureComment(input: $input) {
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

export default UnfeatureCommentMutation;
