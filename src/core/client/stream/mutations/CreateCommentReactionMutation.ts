import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";

import { CreateCommentReactionMutation as MutationTypes } from "talk-stream/__generated__/CreateCommentReactionMutation.graphql";

export type CreateCommentReactionInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation CreateCommentReactionMutation($input: CreateCommentReactionInput!) {
    createCommentReaction(input: $input) {
      comment {
        ...ReactionButtonContainer_comment
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: CreateCommentReactionInput) {
  const source = environment.getStore().getSource();
  const currentCount = source.get(
    source.get(source.get(input.commentID)!.actionCounts.__ref)!.reaction.__ref
  )!.total;

  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...pick(input, ["commentID", "commentRevisionID"]),
        clientMutationId: clientMutationId.toString(),
      },
    },
    optimisticResponse: {
      createCommentReaction: {
        comment: {
          id: input.commentID,
          myActionPresence: {
            reaction: true,
          },
          actionCounts: {
            reaction: {
              total: currentCount + 1,
            },
          },
        },
        clientMutationId: (clientMutationId++).toString(),
      },
    } as any, // TODO: (cvle) generated types should contain one for the optimistic response.
  });
}

export const withCreateCommentReactionMutation = createMutationContainer(
  "createCommentReaction",
  commit
);

export type CreateCommentReactionMutation = (
  input: CreateCommentReactionInput
) => MutationResponsePromise<MutationTypes, "createCommentReaction">;
