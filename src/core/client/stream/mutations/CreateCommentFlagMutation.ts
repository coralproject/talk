import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";

import { CreateCommentFlagMutation as MutationTypes } from "talk-stream/__generated__/CreateCommentFlagMutation.graphql";

export type CreateCommentFlagInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation CreateCommentFlagMutation($input: CreateCommentFlagInput!) {
    createCommentFlag(input: $input) {
      comment {
        id
        myActionPresence {
          flag
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: CreateCommentFlagInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...pick(input, [
          "commentID",
          "commentRevisionID",
          "reason",
          "additionalDetails",
        ]),
        clientMutationId: (clientMutationId++).toString(),
      },
    },
  });
}

export const withCreateCommentFlagMutation = createMutationContainer(
  "createCommentFlag",
  commit
);

export type CreateCommentFlagMutation = (
  input: CreateCommentFlagInput
) => MutationResponsePromise<MutationTypes, "createCommentFlag">;
