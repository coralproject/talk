import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import {
  createSubscription,
  LOCAL_ID,
  lookup,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLCOMMENT_SORT_RL } from "coral-framework/schema";

import { LiveCommentEnteredSubscription } from "coral-stream/__generated__/LiveCommentEnteredSubscription.graphql";

import { isPublished } from "../shared/helpers";

function liveInsertionEnabled(environment: Environment): boolean {
  const liveChat = lookup(environment, LOCAL_ID).liveChat;

  return liveChat.tailing;
}

function insertComment(
  environment: Environment,
  store: RecordSourceSelectorProxy<unknown>,
  storyID: string,
  storyConnectionKey: string,
  comment: RecordProxy,
  tag?: string
) {
  const story = store.get(storyID)!;
  const connection = ConnectionHandler.getConnection(
    story,
    storyConnectionKey,
    {
      orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
      tag,
    }
  )!;

  const liveInsertion = liveInsertionEnabled(environment);

  if (liveInsertion) {
    const edge = ConnectionHandler.createEdge(store, comment, comment, "");

    if (connection) {
      ConnectionHandler.insertEdgeAfter(connection, edge);
    }
  } else {
    const pageInfo = connection.getLinkedRecord("pageInfo")!;
    // Should not be falsy because Relay uses this information to determine
    // whether or not new data is available to load.
    if (!pageInfo.getValue("endCursor")) {
      // Set cursor to oldest date, to load from the beginning.
      pageInfo.setValue(new Date().toISOString(), "endCursor");
    }
    pageInfo.setValue(true, "hasNextPage");
  }
}

type CommentEnteredVariables = Omit<
  SubscriptionVariables<LiveCommentEnteredSubscription>,
  "flattenReplies"
> & {
  /** orderBy that was supplied to the `comments` connection on Story */
  orderBy?: GQLCOMMENT_SORT_RL;
  /** Tag that was supplied to the `comments` connection on Story */
  tag?: string;
  /** If set together with ancestorID, direct replies to the ancestor will immediately displayed */
  liveDirectRepliesInsertion?: boolean;
  /** The relay connection key to find the commments on the story */
  storyConnectionKey: string;
};

const LiveCommentEnteredSubscription = createSubscription(
  "subscribeToCommentEntered",
  (environment: Environment, variables: CommentEnteredVariables) => {
    return requestSubscription(environment, {
      subscription: graphql`
        subscription LiveCommentEnteredSubscription(
          $storyID: ID!
          $ancestorID: ID
        ) {
          commentEntered(storyID: $storyID, ancestorID: $ancestorID) {
            comment {
              id
              createdAt
              status
              parent {
                id
              }
              tags {
                code
              }
              ...LiveCommentContainer_comment
            }
          }
        }
      `,
      variables: {
        storyID: variables.storyID,
        ancestorID: variables.ancestorID,
      },
      updater: (store) => {
        const rootField = store.getRootField("commentEntered");
        if (!rootField) {
          return;
        }

        const comment = rootField.getLinkedRecord("comment")!;
        const commentID = comment.getValue("id")! as string;

        const status = comment.getValue("status");

        const commentInStore = Boolean(
          // We use store from environment here, because it does not contain the response data yet!
          environment.getStore().getSource().get(commentID)
        );
        if (commentInStore) {
          // Comment already in the queue, ignore it as it might be just expected race condition,
          // unless the server is sending the same response multiple times.
          return;
        }
        // If comment is not visible, we don't need to add it.
        if (!isPublished(status)) {
          return;
        }

        const parent = comment.getLinkedRecord("parent");
        const isTopLevelComent = !parent;
        if (
          variables.tag &&
          isTopLevelComent &&
          comment
            .getLinkedRecords("tags")
            ?.every((r) => r.getValue("code") !== variables.tag)
        ) {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.debug(
              "commentEnteredSupscription:",
              "Skipped comment not including tag",
              variables.tag
            );
          }
          return;
        }

        comment.setValue(true, "enteredLive");

        if (!isTopLevelComent) {
          insertComment(
            environment,
            store,
            variables.storyID,
            variables.storyConnectionKey,
            comment,
            variables.tag
          );
          return;
        } else {
          insertComment(
            environment,
            store,
            variables.storyID,
            variables.storyConnectionKey,
            comment,
            variables.tag
          );
          return;
        }
      },
    });
  }
);

export default LiveCommentEnteredSubscription;
