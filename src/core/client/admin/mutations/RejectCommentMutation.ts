import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import { RejectCommentMutation as MutationTypes } from "talk-admin/__generated__/RejectCommentMutation.graphql";
import { getQueueConnection } from "talk-admin/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "talk-framework/lib/relay";

let clientMutationId = 0;

const RejectCommentMutation = createMutation(
  "rejectComment",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RejectCommentMutation($input: RejectCommentInput!) {
          rejectComment(input: $input) {
            comment {
              id
              status
            }
            moderationQueues {
              unmoderated {
                count
              }
              reported {
                count
              }
              pending {
                count
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: clientMutationId.toString(),
        },
      },
      optimisticResponse: {
        rejectComment: {
          comment: {
            id: input.commentID,
            status: "REJECTED",
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
      updater: store => {
        const connections = [
          getQueueConnection("reported", store),
          getQueueConnection("pending", store),
          getQueueConnection("unmoderated", store),
        ].filter(c => c);
        connections.forEach(con =>
          ConnectionHandler.deleteNode(con, input.commentID)
        );
      },
    })
);

export default RejectCommentMutation;
