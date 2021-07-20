import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS } from "coral-framework/schema";
import { ApproveCommentEvent } from "coral-stream/events";

import { ApproveCommentMutation as MutationTypes } from "coral-stream/__generated__/ApproveCommentMutation.graphql";

let clientMutationId = 0;

const ApproveCommentMutation = createMutation(
  "approveComment",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }: CoralContext
  ) => {
    const approveCommentEvent = ApproveCommentEvent.begin(eventEmitter, {
      commentID: input.commentID,
    });
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
                lastViewerAction: "APPROVE",
              },
              clientMutationId: clientMutationId.toString(),
            },
          },
          variables: {
            input: {
              ...input,
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
