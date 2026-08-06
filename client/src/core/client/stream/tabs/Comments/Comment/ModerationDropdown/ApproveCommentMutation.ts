import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import {
  GQLComment,
  GQLCOMMENT_STATUS,
  GQLStory,
} from "coral-framework/schema";
import { ApproveCommentEvent } from "coral-stream/events";

import { ApproveCommentMutation as MutationTypes } from "coral-stream/__generated__/ApproveCommentMutation.graphql";

let clientMutationId = 0;

const ApproveCommentMutation = createMutation(
  "approveComment",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes> & {
      storyID: string;
    },
    { eventEmitter }: CoralContext
  ) => {
    const approveCommentEvent = ApproveCommentEvent.begin(eventEmitter, {
      commentID: input.commentID,
    });
    // Approving can restore the UNANSWERED tag that rejection stripped from a
    // Q&A question, so the tags and tag counts are left untouched optimistically
    // and reconciled from the server response.
    const currentTagCounts = lookup<GQLStory>(environment, input.storyID)
      ?.commentCounts?.tags;
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation ApproveCommentMutation($input: ApproveCommentInput!) {
              approveComment(input: $input) {
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
                        UNANSWERED
                        QUESTION
                      }
                    }
                  }
                  lastViewerAction
                }
                clientMutationId
              }
            }
          `,
          optimisticResponse: {
            approveComment: {
              comment: {
                id: input.commentID,
                status: GQLCOMMENT_STATUS.APPROVED,
                tags: lookup<GQLComment>(
                  environment,
                  input.commentID
                )!.tags.map((t) => ({
                  code: t.code,
                })),
                story: {
                  id: input.storyID,
                  commentCounts: {
                    tags: {
                      FEATURED: currentTagCounts?.FEATURED ?? 0,
                      UNANSWERED: currentTagCounts?.UNANSWERED ?? 0,
                      QUESTION: currentTagCounts?.QUESTION ?? 0,
                    },
                  },
                },
                lastViewerAction: "APPROVE",
              },
              clientMutationId: clientMutationId.toString(),
            },
          },
          variables: {
            input: {
              commentID: input.commentID,
              commentRevisionID: input.commentRevisionID,
              clientMutationId: (clientMutationId++).toString(),
            },
          },
          updater: (store) => {
            const comment = store
              .getRootField("approveComment")!
              .getLinkedRecord("comment")!;
            comment.setValue("APPROVE", "lastViewerAction");
          },
        }
      );
      approveCommentEvent.success();
      return result;
    } catch (error) {
      approveCommentEvent.error({ message: error.message, code: error.code });
      throw error;
    }
  }
);

export default ApproveCommentMutation;
