import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import { getQueueConnection } from "coral-admin/helpers";
import { SectionFilter } from "coral-common/section";
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
    input: MutationInput<MutationTypes> & {
      storyID?: string | null;
      siteID?: string | null;
      section?: SectionFilter | null;
    }
  ) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation ApproveCommentMutation(
          $input: ApproveCommentInput!
          $storyID: ID
          $siteID: ID
          $section: SectionFilter
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
        proxy.setValue("APPROVED", "status");
        proxy.setValue(true, "viewerDidModerate");
      },
      updater: (store) => {
        const connections = [
          getQueueConnection(
            store,
            "REPORTED",
            input.storyID,
            input.siteID,
            input.section
          ),
          getQueueConnection(
            store,
            "PENDING",
            input.storyID,
            input.siteID,
            input.section
          ),
          getQueueConnection(
            store,
            "UNMODERATED",
            input.storyID,
            input.siteID,
            input.section
          ),
          getQueueConnection(
            store,
            "REJECTED",
            input.storyID,
            input.siteID,
            input.section
          ),
        ].filter((c) => c);
        connections.forEach((con) =>
          ConnectionHandler.deleteNode(con!, input.commentID)
        );
      },
    })
);

export default ApproveCommentMutation;
