import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  lookup,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import { GQLComment } from "coral-framework/schema";

import { EditCommentMutation as MutationTypes } from "coral-stream/__generated__/EditCommentMutation.graphql";
import { EditCommentEvent } from "coral-stream/events";

export type EditCommentInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation EditCommentMutation($input: EditCommentInput!) {
    editComment(input: $input) {
      comment {
        id
        body
        status
        revision {
          id
          embeds {
            url
            source
          }
        }
        editing {
          edited
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

async function commit(
  environment: Environment,
  input: EditCommentInput,
  { uuidGenerator, eventEmitter }: CoralContext
) {
  const editCommentEvent = EditCommentEvent.begin(eventEmitter, {
    body: input.body,
    commentID: input.commentID,
  });
  try {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation,
        variables: {
          input: {
            ...pick(input, ["commentID", "body"]),
            clientMutationId: clientMutationId.toString(),
          },
        },
        optimisticResponse: {
          editComment: {
            comment: {
              id: input.commentID,
              body: input.body,
              status: lookup<GQLComment>(environment, input.commentID)!.status,
              revision: {
                id: uuidGenerator(),
                embeds: [],
              },
              editing: {
                edited: true,
              },
            },
            clientMutationId: (clientMutationId++).toString(),
          },
        },
        updater: (store) => {
          store.get(input.commentID)!.setValue("EDIT", "lastViewerAction");
        },
      }
    );
    editCommentEvent.success({ status: result.comment.status });
    return result;
  } catch (error) {
    editCommentEvent.error({ message: error.message, code: error.code });
    throw error;
  }
}

export const withEditCommentMutation = createMutationContainer(
  "editComment",
  commit
);

export type EditCommentMutation = (
  input: EditCommentInput
) => MutationResponsePromise<MutationTypes, "editComment">;
