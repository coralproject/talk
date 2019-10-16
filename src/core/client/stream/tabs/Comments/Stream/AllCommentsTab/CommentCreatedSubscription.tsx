import { graphql, requestSubscription } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLCOMMENT_SORT_RL } from "coral-framework/schema";

import { CommentCreatedSubscription } from "coral-stream/__generated__/CommentCreatedSubscription.graphql";

function updateForNewestFirst(
  store: RecordSourceSelectorProxy,
  storyID: string
) {
  const rootField = store.getRootField("commentCreated");
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
  const story = store.get(storyID)!;
  const connection = ConnectionHandler.getConnection(story, "Stream_comments", {
    orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
  })!;
  const linked = connection.getLinkedRecords("viewNewEdges") || [];
  connection.setLinkedRecords(linked.concat(commentsEdge), "viewNewEdges");
}

function updateForOldestFirst(
  store: RecordSourceSelectorProxy,
  storyID: string
) {
  const story = store.get(storyID)!;
  const connection = ConnectionHandler.getConnection(story, "Stream_comments", {
    orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
  })!;
  const pageInfo = connection.getLinkedRecord("pageInfo") as RecordProxy;
  pageInfo.setValue(true, "hasNextPage");
}

const CommentCreatedSubscription = createSubscription(
  "subscribeToCommentCreated",
  (
    environment: Environment,
    variables: SubscriptionVariables<CommentCreatedSubscription> & {
      orderBy: GQLCOMMENT_SORT_RL;
    }
  ) =>
    requestSubscription(environment, {
      subscription: graphql`
        subscription CommentCreatedSubscription($storyID: ID!) {
          commentCreated(storyID: $storyID) {
            comment {
              id
              createdAt
              ...AllCommentsTabContainer_comment
            }
          }
        }
      `,
      variables,
      updater: store => {
        if (variables.orderBy === GQLCOMMENT_SORT.CREATED_AT_DESC) {
          updateForNewestFirst(store, variables.storyID);
          return;
        }
        if (variables.orderBy === GQLCOMMENT_SORT.CREATED_AT_ASC) {
          updateForOldestFirst(store, variables.storyID);
          return;
        }
        throw new Error(
          `Unsupport new top level comment live updates for sort ${variables.orderBy}`
        );
      },
    })
);

export default CommentCreatedSubscription;
