import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import { getQueueConnection } from "coral-admin/helpers";
import { SectionFilter } from "coral-common/section";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RemoveCommentMutation as MutationTypes } from "coral-admin/__generated__/RemoveCommentMutation.graphql";

let clientMutationId = 0;

const RemoveCommentMutation = createMutation(
  "removeComment",
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
        mutation RemoveCommentMutation($input: RemoveCommentInput!) {
          removeComment(input: $input) {
            success
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          commentID: input.commentID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
      optimisticUpdater: (store) => {
        // const proxy = store.get(input.commentID)!;
      },
      updater: (store, data) => {
        if (!data || !data.removeComment || !data.removeComment.success) {
          return;
        }

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
            "APPROVED",
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

export default RemoveCommentMutation;
