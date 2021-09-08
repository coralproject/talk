import { graphql } from "react-relay";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

import { getQueueConnection } from "coral-admin/helpers";
import { SectionFilter } from "coral-common/section";
import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import {
  GQLCOMMENT_SORT_RL,
  GQLMODERATION_QUEUE_RL,
} from "coral-framework/schema";

import { QueueCommentLeftSubscription } from "coral-admin/__generated__/QueueCommentLeftSubscription.graphql";

function handleCommentLeftModerationQueue(
  store: RecordSourceSelectorProxy<unknown>,
  queue: GQLMODERATION_QUEUE_RL,
  storyID: string | null,
  siteID: string | null,
  orderBy?: GQLCOMMENT_SORT_RL | null,
  section?: SectionFilter | null
) {
  const rootField = store.getRootField("commentLeftModerationQueue");
  if (!rootField) {
    return;
  }
  const comment = rootField.getLinkedRecord("comment")!;
  const commentID = rootField
    .getLinkedRecord("comment")!
    .getValue("id")! as string;
  // Mark that the status of the comment was live updated.
  comment.setValue(true, "statusLiveUpdated");
  const connection = getQueueConnection(
    store,
    queue,
    storyID,
    siteID,
    orderBy,
    section
  );
  if (connection) {
    const linked = connection.getLinkedRecords("viewNewEdges") || [];
    connection.setLinkedRecords(
      linked.filter(
        (r) => r.getLinkedRecord("node")!.getValue("id") !== commentID
      ),
      "viewNewEdges"
    );
  }
}

const QueueSubscription = createSubscription(
  "subscribeToQueueCommentLeft",
  (
    environment: Environment,
    variables: SubscriptionVariables<QueueCommentLeftSubscription>
  ) => ({
    subscription: graphql`
      subscription QueueCommentLeftSubscription(
        $storyID: ID
        $siteID: ID
        $section: SectionFilter
        $orderBy: COMMENT_SORT
        $queue: MODERATION_QUEUE!
      ) {
        commentLeftModerationQueue(
          storyID: $storyID
          siteID: $siteID
          section: $section
          orderBy: $orderBy
          queue: $queue
        ) {
          comment {
            id
            status
            ...MarkersContainer_comment @relay(mask: false)
            ...ModeratedByContainer_comment @relay(mask: false)
          }
        }
      }
    `,
    variables,
    updater: (store) => {
      handleCommentLeftModerationQueue(
        store,
        variables.queue,
        variables.storyID || null,
        variables.siteID || null,
        variables.orderBy || null,
        variables.section
      );
    },
  })
);

export default QueueSubscription;
