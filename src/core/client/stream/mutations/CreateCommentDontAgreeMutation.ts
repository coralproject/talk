import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";

import { CreateCommentDontAgreeMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentDontAgreeMutation.graphql";

export type CreateCommentDontAgreeInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation CreateCommentDontAgreeMutation(
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
`;

let clientMutationId = 0;

function commit(environment: Environment, input: CreateCommentDontAgreeInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...pick(input, ["commentID", "commentRevisionID", "additionalDetails"]),
        clientMutationId: (clientMutationId++).toString(),
      },
    },
  });
}

export const withCreateCommentDontAgreeMutation = createMutationContainer(
  "createCommentDontAgree",
  commit
);

export type CreateCommentDontAgreeMutation = (
  input: CreateCommentDontAgreeInput
) => MutationResponsePromise<MutationTypes, "createCommentDontAgree">;
