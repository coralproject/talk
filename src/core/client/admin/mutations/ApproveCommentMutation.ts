import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import { ApproveCommentMutation as MutationTypes } from "coral-admin/__generated__/ApproveCommentMutation.graphql";
import { getQueueConnection } from "coral-admin/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

let clientMutationId = 0;

const ApproveCommentMutation = createMutation(
  "approveComment",
  (
    environment: Environment,
    input: MutationInput<MutationTypes> & { storyID?: string }
  ) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation ApproveCommentMutation(
          $input: ApproveCommentInput!
          $storyID: ID
        ) {
          approveComment(input: $input) {
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
          clientMutationId: (clientMutationId++).toString(),
        },
      },
      optimisticUpdater: store => {
        store.get(input.commentID)!.setValue("APPROVED", "status");
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

export default ApproveCommentMutation;
