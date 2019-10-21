import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import { getQueueConnection } from "coral-admin/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { ApproveCommentMutation as MutationTypes } from "coral-admin/__generated__/ApproveCommentMutation.graphql";

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
              author {
                id
                recentCommentHistory {
                  statuses {
                    NONE
                    APPROVED
                    REJECTED
                    PREMOD
                    SYSTEM_WITHHELD
                  }
                }
              }
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
        store.get(input.commentID)!.setValue("APPROVED", "status");
      },
      updater: store => {
        const connections = [
          getQueueConnection(store, "REPORTED", input.storyID),
          getQueueConnection(store, "PENDING", input.storyID),
          getQueueConnection(store, "UNMODERATED", input.storyID),
          getQueueConnection(store, "REJECTED", input.storyID),
        ].filter(c => c);
        connections.forEach(con =>
          ConnectionHandler.deleteNode(con, input.commentID)
        );
      },
    })
);

export default ApproveCommentMutation;
