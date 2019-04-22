import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import { AcceptCommentMutation as MutationTypes } from "talk-admin/__generated__/AcceptCommentMutation.graphql";
import { getQueueConnection } from "talk-admin/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "talk-framework/lib/relay";

let clientMutationId = 0;

const AcceptCommentMutation = createMutation(
  "acceptComment",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation AcceptCommentMutation($input: AcceptCommentInput!) {
          acceptComment(input: $input) {
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
        acceptComment: {
          comment: {
            id: input.commentID,
            status: "ACCEPTED",
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
      updater: store => {
        const connections = [
          getQueueConnection("reported", store),
          getQueueConnection("pending", store),
          getQueueConnection("unmoderated", store),
          getQueueConnection("rejected", store),
        ].filter(c => c);
        connections.forEach(con =>
          ConnectionHandler.deleteNode(con, input.commentID)
        );
      },
    })
);

export default AcceptCommentMutation;
