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
import { CreateCommentReactionMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentReactionMutation.graphql";

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
          viewerActionPresence: {
            reaction: true,
          },
          revision: {
            id: lookup<GQLComment>(environment, input.commentID)!.revision.id,
          },
          actionCounts: {
            reaction: {
              total: currentCount + 1,
            },
          },
        } as any,
        clientMutationId: (clientMutationId++).toString(),
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
) => MutationResponsePromise<MutationTypes, "createCommentReaction">;
