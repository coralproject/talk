import { graphql, requestSubscription } from "react-relay";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

import { getQueueConnection } from "coral-admin/helpers";
import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLMODERATION_QUEUE_RL } from "coral-framework/schema";

import { QueueCommentEnteredSubscription } from "coral-admin/__generated__/QueueCommentEnteredSubscription.graphql";

function handleCommentEnteredModerationQueue(
  store: RecordSourceSelectorProxy,
  queue: GQLMODERATION_QUEUE_RL,
  storyID: string | null
) {
  const rootField = store.getRootField("commentEnteredModerationQueue");
  if (!rootField) {
    return;
  }
  const comment = rootField.getLinkedRecord("comment")!;
  comment.setValue(true, "enteredLive");
  const commentsEdge = store.create(
    `edge-${comment.getValue("id")!}`,
    "CommentsEdge"
  );
  commentsEdge.setValue(comment.getValue("createdAt"), "cursor");
  commentsEdge.setLinkedRecord(comment, "node");
  const connection = getQueueConnection(store, queue, storyID);
  if (connection) {
    const linked = connection.getLinkedRecords("viewNewEdges") || [];
    connection.setLinkedRecords(linked.concat(commentsEdge), "viewNewEdges");
  }
}

const QueueSubscription = createSubscription(
  "subscribeToQueueCommentEntered",
  (
    environment: Environment,
    variables: SubscriptionVariables<QueueCommentEnteredSubscription>
  ) =>
    requestSubscription(environment, {
      subscription: graphql`
        subscription QueueCommentEnteredSubscription(
          $storyID: ID
          $queue: MODERATION_QUEUE!
        ) {
          commentEnteredModerationQueue(storyID: $storyID, queue: $queue) {
            comment {
              id
              createdAt
              ...ModerateCardContainer_comment
            }
          }
        }
      `,
      variables,
      updater: store => {
        handleCommentEnteredModerationQueue(
          store,
          variables.queue,
          variables.storyID || null
        );
      },
    })
);

export default QueueSubscription;
