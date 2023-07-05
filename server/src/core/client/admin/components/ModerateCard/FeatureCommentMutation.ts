import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import { getQueueConnection } from "coral-admin/helpers";
import { SectionFilter } from "coral-common/section";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import {
  GQLCOMMENT_SORT_RL,
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-framework/schema";

import { FeatureCommentMutation } from "coral-admin/__generated__/FeatureCommentMutation.graphql";

let clientMutationId = 0;

const FeatureCommentMutation = createMutation(
  "featureComment",
  (
    environment: Environment,
    input: MutationInput<FeatureCommentMutation> & {
      storyID: string | null;
      siteID: string | null;
      section: SectionFilter | null;
      orderBy: GQLCOMMENT_SORT_RL | null;
    },
    { uuidGenerator }: CoralContext
  ) =>
    commitMutationPromiseNormalized<FeatureCommentMutation>(environment, {
      mutation: graphql`
        mutation FeatureCommentMutation(
          $input: FeatureCommentInput!
          $storyID: ID
        ) {
          featureComment(input: $input) {
            comment {
              tags {
                code
              }
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
        storyID: input.storyID,
      },
      optimisticUpdater: (store) => {
        const comment = store.get(input.commentID)!;
        const tags = comment.getLinkedRecords("tags");
        if (tags) {
          const newTag = store.create(uuidGenerator(), "Tag");
          newTag.setValue(GQLTAG.FEATURED, "code");
          comment.setLinkedRecords(tags.concat(newTag), "tags");
          comment.setValue(GQLCOMMENT_STATUS.APPROVED, "status");
        }
      },
      updater: (store) => {
        const connections = [
          getQueueConnection(
            store,
            "PENDING",
            input.storyID,
            input.siteID,
            input.orderBy,
            input.section
          ),
          getQueueConnection(
            store,
            "REPORTED",
            input.storyID,
            input.siteID,
            input.orderBy,
            input.section
          ),
          getQueueConnection(
            store,
            "UNMODERATED",
            input.storyID,
            input.siteID,
            input.orderBy,
            input.section
          ),
          getQueueConnection(
            store,
            "REJECTED",
            input.storyID,
            input.siteID,
            input.orderBy,
            input.section
          ),
        ].filter((c) => c);
        connections.forEach((con) =>
          ConnectionHandler.deleteNode(con!, input.commentID)
        );
      },
    })
);

export default FeatureCommentMutation;
