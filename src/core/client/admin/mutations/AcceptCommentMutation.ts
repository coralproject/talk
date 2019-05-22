import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import { AcceptCommentMutation as MutationTypes } from "coral-admin/__generated__/AcceptCommentMutation.graphql";
import { getQueueConnection } from "coral-admin/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

let clientMutationId = 0;

const AcceptCommentMutation = createMutation(
  "acceptComment",
  (
    environment: Environment,
    input: MutationInput<MutationTypes> & { storyID?: string }
  ) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation AcceptCommentMutation(
          $input: AcceptCommentInput!
          $storyID: ID
        ) {
          acceptComment(input: $input) {
            comment {
              id
              status
            }
            moderationQueues(storyID: $storyID) {
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
          commentID: input.commentID,
          commentRevisionID: input.commentRevisionID,
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
          getQueueConnection(store, "reported", input.storyID),
          getQueueConnection(store, "pending", input.storyID),
          getQueueConnection(store, "unmoderated", input.storyID),
          getQueueConnection(store, "rejected", input.storyID),
        ].filter(c => c);
        connections.forEach(con =>
          ConnectionHandler.deleteNode(con, input.commentID)
        );
      },
    })
);

export default AcceptCommentMutation;
