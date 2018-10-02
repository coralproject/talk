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
        ...ReactionButtonContainer_comment
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
    optimisticResponse: {
      deleteCommentReaction: {
        comment: {
          id: input.commentID,
        },
        clientMutationId: clientMutationId.toString(),
      },
    } as any, // TODO: (cvle) generated types should contain one for the optimistic response.
  });
}

export const withDeleteCommentReactionMutation = createMutationContainer(
  "deleteCommentReaction",
  commit
);

export type DeleteCommentReactionMutation = (
  input: CreateCommentReactionInput
) => Promise<MutationTypes["response"]["deleteCommentReaction"]>;
