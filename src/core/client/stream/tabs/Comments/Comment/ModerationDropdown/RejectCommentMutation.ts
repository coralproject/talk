import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { RejectCommentEvent } from "coral-stream/events";
import { GQLComment, GQLCOMMENT_STATUS } from "coral-stream/schema";

import { RejectCommentMutation as MutationTypes } from "coral-stream/__generated__/RejectCommentMutation.graphql";

let clientMutationId = 0;

const RejectCommentMutation = createMutation(
  "rejectComment",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes> & { storyID: string; noEmit?: boolean },
    { eventEmitter }: CoralContext
  ) => {
    let rejectCommentEvent: ReturnType<
      typeof RejectCommentEvent.begin
    > | null = null;
    if (!input.noEmit) {
      rejectCommentEvent = RejectCommentEvent.begin(eventEmitter, {
        commentID: input.commentID,
      });
    }
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation RejectCommentMutation($input: RejectCommentInput!) {
              rejectComment(input: $input) {
                comment {
                  id
                  status
                  tags {
                    code
                  }
                  story {
                    id
                    commentCounts {
                      tags {
                        FEATURED
                      }
                    }
                  }
                }
                clientMutationId
              }
            }
          `,
          variables: {
            input: {
              commentID: input.commentID,
              commentRevisionID: input.commentRevisionID,
              clientMutationId: (clientMutationId++).toString(),
            },
          },
          optimisticResponse: {
            rejectComment: {
              comment: {
                id: input.commentID,
                status: GQLCOMMENT_STATUS.REJECTED,
                tags: lookup<GQLComment>(environment, input.commentID)!.tags,
                story: {
                  id: input.storyID,
                  commentCounts: {
                    tags: {
                      FEATURED: 0,
                    },
                  },
                },
              },
              clientMutationId: clientMutationId.toString(),
            },
          },
          updater: (store) => {
            store.get(input.commentID)!.setValue("REJECT", "lastViewerAction");
          },
        }
      );
      if (rejectCommentEvent) {
        rejectCommentEvent.success();
      }
      return result;
    } catch (error) {
      if (rejectCommentEvent) {
        rejectCommentEvent.error({ message: error.message, code: error.code });
      }
      throw error;
    }
  }
);

export default RejectCommentMutation;
