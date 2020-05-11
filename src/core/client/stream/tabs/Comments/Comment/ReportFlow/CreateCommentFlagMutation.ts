import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CreateCommentFlagMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentFlagMutation.graphql";

let clientMutationId = 0;

const CreateCommentFlagMutation = createMutation(
  "createCommentFlag",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CreateCommentFlagMutation($input: CreateCommentFlagInput!) {
          createCommentFlag(input: $input) {
            comment {
              id
              viewerActionPresence {
                flag
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          commentID: input.commentID,
          commentRevisionID: input.commentRevisionID,
          reason: input.reason,
          additionalDetails: input.additionalDetails,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default CreateCommentFlagMutation;
