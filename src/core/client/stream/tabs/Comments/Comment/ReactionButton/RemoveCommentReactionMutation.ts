import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  lookup,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import { GQLComment } from "coral-framework/schema";

import { RemoveCommentReactionMutation as MutationTypes } from "coral-stream/__generated__/RemoveCommentReactionMutation.graphql";

export type RemoveCommentReactionInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation RemoveCommentReactionMutation($input: RemoveCommentReactionInput!) {
    removeCommentReaction(input: $input) {
      comment {
        ...ReactionButtonContainer_comment
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: RemoveCommentReactionInput) {
  const source = environment.getStore().getSource();
  const currentCount = source.get(
    source.get(source.get(input.commentID)!.actionCounts.__ref)!.reaction.__ref
  )!.total;
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...pick(input, ["commentID"]),
        clientMutationId: (clientMutationId++).toString(),
      },
    },
    optimisticResponse: {
      removeCommentReaction: {
        comment: {
          id: input.commentID,
          viewerActionPresence: {
            reaction: false,
          },
          revision: {
            // Can assume revision exists since we just selected
            // to remove the reaction to it.
            id: lookup<GQLComment>(environment, input.commentID)!.revision!.id,
          },
          actionCounts: {
            reaction: {
              total: currentCount - 1,
            },
          },
        } as any,
        clientMutationId: clientMutationId.toString(),
      },
    },
  });
}

export const withRemoveCommentReactionMutation = createMutationContainer(
  "removeCommentReaction",
  commit
);

export type RemoveCommentReactionMutation = (
  input: RemoveCommentReactionInput
) => MutationResponsePromise<MutationTypes, "removeCommentReaction">;
