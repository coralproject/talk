import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import { GQLComment } from "coral-framework/schema";
import { CreateCommentReactionEvent } from "coral-stream/events";

import { CreateCommentReactionMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentReactionMutation.graphql";

export type CreateCommentReactionInput = MutationInput<MutationTypes> & {
  author?: {
    id: string;
    username: string | undefined | null;
  } | null;
};

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

async function commit(
  environment: Environment,
  input: CreateCommentReactionInput,
  { eventEmitter }: Pick<CoralContext, "eventEmitter">
) {
  const currentCount = lookup(environment, input.commentID).actionCounts
    .reaction.total;

  const createCommentReactionEvent = CreateCommentReactionEvent.begin(
    eventEmitter,
    {
      commentID: input.commentID,
    }
  );
  try {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
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
              author: {
                id: input.author?.id,
                username: input.author?.username,
              },
              viewerActionPresence: {
                reaction: true,
              },
              revision: {
                // comment revision should not be null since we just
                // reacted to it, revision can only be null when user
                // deletes their account and thus all their comments
                id: lookup<GQLComment>(environment, input.commentID)!.revision!
                  .id,
              },
              actionCounts: {
                reaction: {
                  total: (currentCount as number) + 1,
                },
              },
            } as any,
            clientMutationId: (clientMutationId++).toString(),
          },
        },
      }
    );
    createCommentReactionEvent.success();
    return result;
  } catch (error) {
    createCommentReactionEvent.error({
      message: error.message,
      code: error.code,
    });
    throw error;
  }
}

export type CreateCommentReactionMutation = (
  input: CreateCommentReactionInput
) => MutationResponsePromise<MutationTypes, "createCommentReaction">;

export default createMutation("createCommentReaction", commit);
