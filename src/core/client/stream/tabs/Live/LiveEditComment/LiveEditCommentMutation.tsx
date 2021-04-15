import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLComment } from "coral-framework/schema";
import { EditCommentEvent } from "coral-stream/events";
import { isPublished } from "coral-stream/tabs/shared/helpers";

import { LiveEditCommentMutation as MutationTypes } from "coral-stream/__generated__/LiveEditCommentMutation.graphql";
import removeLiveChatComment from "../helpers/removeLiveChatComment";

export type LiveEditCommentInput = MutationInput<MutationTypes> & {
  storyID: string;
  ancestorID?: string;
};

const mutation = graphql`
  mutation LiveEditCommentMutation($input: EditCommentInput!) {
    editComment(input: $input) {
      comment {
        ...MediaSectionContainer_comment @relay(mask: false)
        id
        body
        status
        revision {
          id
        }
        editing {
          edited
        }
      }
      clientMutationId
    }
  }
`;

const clientMutationId = 0;

async function commit(
  environment: Environment,
  input: LiveEditCommentInput,
  { uuidGenerator, eventEmitter }: CoralContext
) {
  const editCommentEvent = EditCommentEvent.begin(eventEmitter, {
    body: input.body,
    commentID: input.commentID,
  });
  try {
    const lookupComment = lookup<GQLComment>(environment, input.commentID)!;
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
              status: lookupComment.status,
              revision: {
                id: uuidGenerator(),
                media: null,
              },
              site: {
                id: lookupComment.site.id,
              },
              editing: {
                edited: true,
              },
            },
            clientMutationId: clientMutationId.toString(),
          },
        },
        updater: (store) => {
          const commentRecordFromCache = store.get(input.commentID)!;
          commentRecordFromCache.setValue("EDIT", "lastViewerAction");

          const commentRecord = store
            .getRootField("editComment")!
            .getLinkedRecord("comment")!;

          // Comment is not published after edit, so don't render it anymore.
          if (!isPublished(commentRecord.getValue("status"))) {
            removeLiveChatComment(
              store,
              input.commentID,
              input.storyID,
              input.ancestorID
            );
          }
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

export const LiveEditCommentMutation = createMutation(
  "liveEditComment",
  commit
);
