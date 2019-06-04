import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { RejectCommentMutation as MutationTypes } from "coral-stream/__generated__/RejectCommentMutation.graphql";

let clientMutationId = 0;

const RejectCommentMutation = createMutation(
  "rejectComment",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RejectCommentMutation($input: RejectCommentInput!) {
          rejectComment(input: $input) {
            comment {
              status
            }
            clientMutationId
          }
        }
      `,
      optimisticResponse: {
        rejectComment: {
          comment: {
            status: "REJECTED",
          },
        },
      },
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
      updater: store => {
        store.get(input.commentID)!.setValue("REJECT", "lastViewerAction");
      },
    })
);

export default RejectCommentMutation;
