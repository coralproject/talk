import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { CreateCommentReactionMutation as MutationTypes } from "talk-stream/__generated__/CreateCommentReactionMutation.graphql";

export type CreateCommentReactionInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation CreateCommentReactionMutation($input: CreateCommentReactionInput!) {
    createCommentReaction(input: $input) {
      comment {
        id
        actionCounts {
          reaction {
            total
          }
        }
      }
      clientMutationId
    }
  }
`;

const clientMutationId = 0;

function commit(environment: Environment, input: CreateCommentReactionInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: clientMutationId.toString(),
      },
    },
  });
}

export const withCreateCommentReactionMutation = createMutationContainer(
  "createCommentReaction",
  commit
);

export type CreateCommentReactionMutation = (
  input: CreateCommentReactionInput
) => Promise<MutationTypes["response"]["createCommentReaction"]>;
