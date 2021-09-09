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

import { QueueCommentEnteredSubscription } from "coral-admin/__generated__/QueueCommentEnteredSubscription.graphql";

function updateForOldestFirst(
  store: RecordSourceSelectorProxy<unknown>,
  queue: GQLMODERATION_QUEUE_RL,
  storyID: string | null,
  siteID: string | null,
  orderBy: GQLCOMMENT_SORT_RL | null,
  section?: SectionFilter | null
) {
  const rootField = store.getRootField("commentEnteredModerationQueue");
  if (!rootField) {
    return;
  }

  const comment = rootField.getLinkedRecord("comment")!;
  const commentID = comment.getValue("id")!;
  const edgeID = `edge-${commentID}`;
  const edgeInQueue = Boolean(store.get(edgeID));

  if (edgeInQueue) {
    // Comment edge already in the queue, ignore it as it might be just expected race condition,
    // unless the server is sending the same response multiple times.
    return;
  }

  const connection = getQueueConnection(
    store,
    queue,
    storyID,
    siteID,
    orderBy,
    section
  );
  if (!connection) {
    return;
  }

  const pageInfo = connection.getLinkedRecord("pageInfo")!;
  // Should not be falsy because Relay uses this information to determine
  // whether or not new data is available to load.
  if (!pageInfo.getValue("endCursor")) {
    // Set cursor to oldest date, to load from the beginning.
    pageInfo.setValue(new Date(0).toISOString(), "endCursor");
  }
  pageInfo.setValue(true, "hasNextPage");
}

function updateForNewestFirst(
  store: RecordSourceSelectorProxy<unknown>,
  queue: GQLMODERATION_QUEUE_RL,
  storyID: string | null,
  siteID: string | null,
  orderBy: GQLCOMMENT_SORT_RL | null,
  section?: SectionFilter | null
) {
  const rootField = store.getRootField("commentEnteredModerationQueue");
  if (!rootField) {
    return;
  }
  const comment = rootField.getLinkedRecord("comment")!;
  const commentID = comment.getValue("id")!;
  const edgeID = `edge-${commentID}`;
  const edgeInQueue = Boolean(store.get(edgeID));
  if (edgeInQueue) {
    // Comment edge already in the queue, ignore it as it might be just expected race condition,
    // unless the server is sending the same response multiple times.
    return;
  }
  comment.setValue(true, "enteredLive");
  const commentsEdge = store.create(edgeID, "CommentsEdge");
  commentsEdge.setValue(comment.getValue("createdAt"), "cursor");
  commentsEdge.setLinkedRecord(comment, "node");
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
    connection.setLinkedRecords(linked.concat(commentsEdge), "viewNewEdges");
  }
}

function handleCommentEnteredModerationQueue(
  store: RecordSourceSelectorProxy<unknown>,
  queue: GQLMODERATION_QUEUE_RL,
  storyID: string | null,
  siteID: string | null,
  orderBy: GQLCOMMENT_SORT_RL | null,
  section?: SectionFilter | null
) {
  if (orderBy === "CREATED_AT_DESC") {
    updateForNewestFirst(store, queue, storyID, siteID, orderBy, section);
  } else if (orderBy === "CREATED_AT_ASC") {
    updateForOldestFirst(store, queue, storyID, siteID, orderBy, section);
  }
}

const QueueSubscription = createSubscription(
  "subscribeToQueueCommentEntered",
  (
    environment: Environment,
    variables: SubscriptionVariables<QueueCommentEnteredSubscription>
  ) => ({
    subscription: graphql`
      subscription QueueCommentEnteredSubscription(
        $storyID: ID
        $siteID: ID
        $section: SectionFilter
        $orderBy: COMMENT_SORT
        $queue: MODERATION_QUEUE!
      ) {
        commentEnteredModerationQueue(
          storyID: $storyID
          siteID: $siteID
          section: $section
          orderBy: $orderBy
          queue: $queue
        ) {
          comment {
            id
            createdAt
            ...ModerateCardContainer_comment
          }
        }
      }
    `,
    variables,
    updater: (store) => {
      handleCommentEnteredModerationQueue(
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
