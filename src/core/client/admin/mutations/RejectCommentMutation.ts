import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import { RejectCommentMutation as MutationTypes } from "coral-admin/__generated__/RejectCommentMutation.graphql";
import { getQueueConnection } from "coral-admin/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

let clientMutationId = 0;

const RejectCommentMutation = createMutation(
  "rejectComment",
  (
    environment: Environment,
    input: MutationInput<MutationTypes> & { storyID?: string }
  ) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RejectCommentMutation(
          $input: RejectCommentInput!
          $storyID: ID
        ) {
          rejectComment(input: $input) {
            comment {
              id
              status
              statusHistory(first: 1) {
                edges {
                  node {
                    moderator {
                      username
                    }
                  }
                }
              }
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
        storyID: input.storyID,
      },
      optimisticUpdater: store => {
        store.get(input.commentID)!.setValue("REJECTED", "status");
      },
      updater: store => {
        const connections = [
          getQueueConnection(store, "REPORTED", input.storyID),
          getQueueConnection(store, "PENDING", input.storyID),
          getQueueConnection(store, "UNMODERATED", input.storyID),
        ].filter(c => c);
        connections.forEach(con =>
          ConnectionHandler.deleteNode(con, input.commentID)
        );
      },
    })
);

export default RejectCommentMutation;
