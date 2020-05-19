import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import { getQueueConnection } from "coral-admin/helpers";
import { SectionFilter } from "coral-common/section";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RejectCommentMutation as MutationTypes } from "coral-admin/__generated__/RejectCommentMutation.graphql";

let clientMutationId = 0;

const RejectCommentMutation = createMutation(
  "rejectComment",
  (
    environment: Environment,
    input: MutationInput<MutationTypes> & {
      storyID?: string | null;
      siteID?: string | null;
      section?: SectionFilter | null;
    }
  ) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RejectCommentMutation(
          $input: RejectCommentInput!
          $storyID: ID
          $siteID: ID
          $section: SectionFilter
        ) {
          rejectComment(input: $input) {
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
              ...ModeratedByContainer_comment
            }
            moderationQueues(
              storyID: $storyID
              siteID: $siteID
              section: $section
            ) {
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
        siteID: input.siteID,
        section: input.section,
      },
      optimisticUpdater: (store) => {
        const proxy = store.get(input.commentID)!;
        proxy.setValue("REJECTED", "status");
        proxy.setValue(true, "viewerDidModerate");
      },
      updater: (store) => {
        const connections = [
          getQueueConnection(store, "REPORTED", input.storyID),
          getQueueConnection(store, "PENDING", input.storyID),
          getQueueConnection(store, "UNMODERATED", input.storyID),
          getQueueConnection(store, "APPROVED", input.storyID),
        ].filter((c) => c);
        connections.forEach((con) =>
          ConnectionHandler.deleteNode(con!, input.commentID)
        );
      },
    })
);

export default RejectCommentMutation;
