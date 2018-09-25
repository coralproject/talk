import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";

import { DeleteCommentReactionMutation as MutationTypes } from "talk-stream/__generated__/DeleteCommentReactionMutation.graphql";
import { CreateCommentReactionInput } from "./CreateCommentReactionMutation";

const mutation = graphql`
  mutation DeleteCommentReactionMutation($input: CreateCommentReactionInput!) {
    deleteCommentReaction(input: $input) {
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

export const withDeleteCommentReactionMutation = createMutationContainer(
  "deleteCommentReaction",
  commit
);

export type DeleteCommentReactionMutation = (
  input: CreateCommentReactionInput
) => Promise<MutationTypes["response"]["deleteCommentReaction"]>;
