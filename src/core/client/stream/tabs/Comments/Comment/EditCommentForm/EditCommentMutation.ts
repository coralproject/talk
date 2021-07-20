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
import { EditCommentEvent } from "coral-stream/events";

import { EditCommentMutation as MutationTypes } from "coral-stream/__generated__/EditCommentMutation.graphql";

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
          media {
            __typename
            ... on GiphyMedia {
              url
              title
              width
              height
              still
              video
            }
            ... on ExternalMedia {
              url
            }
            ... on TwitterMedia {
              url
              width
            }
            ... on YouTubeMedia {
              url
              width
              height
            }
          }
        }
        editing {
          edited
        }
        lastViewerAction
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
            ...pick(input, ["commentID", "body", "media"]),
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
                media: null,
              },
              editing: {
                edited: true,
              },
              lastViewerAction: "EDIT",
            },
            clientMutationId: (clientMutationId++).toString(),
          },
        },
        updater: (store) => {
          const comment = store
            .getRootField("editComment")!
            .getLinkedRecord("comment")!;
          comment.setValue("EDIT", "lastViewerAction");
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
