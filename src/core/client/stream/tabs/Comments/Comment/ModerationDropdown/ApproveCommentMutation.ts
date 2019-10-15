import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS } from "coral-framework/schema";

import { ApproveCommentMutation as MutationTypes } from "coral-stream/__generated__/ApproveCommentMutation.graphql";

let clientMutationId = 0;

const ApproveCommentMutation = createMutation(
  "approveComment",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation ApproveCommentMutation($input: ApproveCommentInput!) {
          approveComment(input: $input) {
            comment {
              status
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
      updater: store => {
        store.get(input.commentID)!.setValue("APPROVE", "lastViewerAction");
      },
    })
);

export default ApproveCommentMutation;
