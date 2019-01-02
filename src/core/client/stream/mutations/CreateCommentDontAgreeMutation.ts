import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { CreateCommentDontAgreeMutation as MutationTypes } from "talk-stream/__generated__/CreateCommentDontAgreeMutation.graphql";

export type CreateCommentDontAgreeInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation CreateCommentDontAgreeMutation(
    $input: CreateCommentDontAgreeInput!
  ) {
    createCommentDontAgree(input: $input) {
      comment {
        id
        myActionPresence {
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
) => Promise<MutationTypes["response"]["createCommentDontAgree"]>;
