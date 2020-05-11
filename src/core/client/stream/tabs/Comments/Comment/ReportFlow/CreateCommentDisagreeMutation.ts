import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CreateCommentDisagreeMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentDisagreeMutation.graphql";

let clientMutationId = 0;

const CreateCommentDisagreeMutation = createMutation(
  "createCommentDisagree",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CreateCommentDisagreeMutation(
          $input: CreateCommentDontAgreeInput!
        ) {
          createCommentDontAgree(input: $input) {
            comment {
              id
              viewerActionPresence {
                dontAgree
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
          additionalDetails: input.additionalDetails,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default CreateCommentDisagreeMutation;
