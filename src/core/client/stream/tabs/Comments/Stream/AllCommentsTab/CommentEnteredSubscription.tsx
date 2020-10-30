import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import {
  createSubscription,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLCOMMENT_SORT_RL } from "coral-framework/schema";

import { CommentEnteredSubscription } from "coral-stream/__generated__/CommentEnteredSubscription.graphql";

function updateForNewestFirst(
  store: RecordSourceSelectorProxy<unknown>,
  storyID: string,
  storyConnectionKey: string,
  tag?: string
) {
  const rootField = store.getRootField("commentEntered");
  if (!rootField) {
    return;
  }
  const comment = rootField.getLinkedRecord("comment")!;
  const commentsEdge = store.create(
    `edge-${comment.getValue("id")!}`,
    "CommentsEdge"
  );
  commentsEdge.setValue(comment.getValue("createdAt"), "cursor");
  commentsEdge.setLinkedRecord(comment, "node");
  const story = store.get(storyID)!;
  const connection = ConnectionHandler.getConnection(
    story,
    storyConnectionKey,
    {
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      tag,
    }
  )!;
  const linked = connection.getLinkedRecords("viewNewEdges") || [];
  connection.setLinkedRecords(linked.concat(commentsEdge), "viewNewEdges");
}

function updateForOldestFirst(
  store: RecordSourceSelectorProxy<unknown>,
  storyID: string,
  storyConnectionKey: string,
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
  const pageInfo = connection.getLinkedRecord("pageInfo")!;
  // Should not be falsy because Relay uses this information to determine
  // whether or not new data is available to load.
  if (!pageInfo.getValue("endCursor")) {
    // Set cursor to oldest date, to load from the beginning.
    pageInfo.setValue(new Date(0).toISOString(), "endCursor");
  }
  pageInfo.setValue(true, "hasNextPage");
}

/**
 * Returns depth until ancestor.
 */
function determineDepthTillAncestor(
  comment: RecordProxy,
  ancestorID?: string | null
) {
  let depth = 0;
  let cur: RecordProxy | null | undefined = comment;
  while (cur) {
    // Check whether or not the parent already exists in our cache.
    cur = cur.getLinkedRecord("parent");
    // Because we request the parent including its id in the the subscription below
    // we can't just check for truthiness nor check the `id` field of the record to determine
    // that it already exists in our cache. Therefore we check for another field that
    // is part of the `CommentContainer_comment` fragment.
    if (cur?.getValue("createdAt")) {
      depth++;
      // Stop when reaching base ancestor.
      if (cur.getValue("id") === ancestorID) {
        return depth;
      }
    } else if (depth === 0) {
      return null;
    }
  }
  return depth;
}

function insertReply(
  store: RecordSourceSelectorProxy<unknown>,
  liveDirectRepliesInsertion: boolean,
  ancestorID?: string | null
) {
  const comment = store
    .getRootField("commentEntered")!
    .getLinkedRecord("comment")!;
  const parentID = comment.getLinkedRecord("parent")!.getValue("id")! as string;
  const parentProxy = store.get(parentID)!;

  const depth = determineDepthTillAncestor(comment, ancestorID);
  if (depth === null) {
    // could not trace back to ancestor, discard.
    return;
  }

  // Comment is just outside our visible depth.
  if (depth >= 4) {
    // Inform last comment in visible tree about the available replies.
    // This will trigger to show the `Read More of this Conversation` link.
    const replyCount = (parentProxy.getValue("replyCount") as number) || 0;
    parentProxy.setValue(replyCount + 1, "replyCount");
    return;
  }

  const connectionKey = "ReplyList_replies";
  const filters = { orderBy: "CREATED_AT_ASC" };
  const connection = ConnectionHandler.getConnection(
    parentProxy,
    connectionKey,
    filters
  );
  if (!connection) {
    // If it has no connection, it could not have been
    // in our visible tree.
    return;
  }
  if (connection.getLinkedRecord("pageInfo")!.getValue("hasNextPage")) {
    // It hasn't loaded all comments yet, ignore this one.
    return;
  }
  const commentsEdge = store.create(
    `edge-${comment.getValue("id")!}`,
    "CommentsEdge"
  );
  commentsEdge.setValue(comment.getValue("createdAt"), "cursor");
  commentsEdge.setLinkedRecord(comment, "node");
  if (parentProxy.getValue("id") === ancestorID && liveDirectRepliesInsertion) {
    ConnectionHandler.insertEdgeAfter(connection, commentsEdge);
  } else {
    const linked = connection.getLinkedRecords("viewNewEdges") || [];
    connection.setLinkedRecords(linked.concat(commentsEdge), "viewNewEdges");
  }
}

type CommentEnteredVariables = SubscriptionVariables<
  CommentEnteredSubscription
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

const CommentEnteredSubscription = createSubscription(
  "subscribeToCommentEntered",
  (environment: Environment, variables: CommentEnteredVariables) =>
    requestSubscription(environment, {
      subscription: graphql`
        subscription CommentEnteredSubscription(
          $storyID: ID!
          $ancestorID: ID
        ) {
          commentEntered(storyID: $storyID, ancestorID: $ancestorID) {
            comment {
              id
              createdAt
              parent {
                id
              }
              tags {
                code
              }
              ...AllCommentsTabContainer_comment
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

        const commentInStore = Boolean(
          // We use store from environment here, because it does not contain the response data yet!
          environment.getStore().getSource().get(commentID)
        );
        if (commentInStore) {
          // Comment already in the queue, ignore it as it might be just expected race condition,
          // unless the server is sending the same response multiple times.
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
          insertReply(
            store,
            Boolean(variables.liveDirectRepliesInsertion),
            variables.ancestorID
          );
          return;
        } else if (variables.orderBy === GQLCOMMENT_SORT.CREATED_AT_DESC) {
          updateForNewestFirst(
            store,
            variables.storyID,
            variables.storyConnectionKey,
            variables.tag
          );
          return;
        } else if (variables.orderBy === GQLCOMMENT_SORT.CREATED_AT_ASC) {
          updateForOldestFirst(
            store,
            variables.storyID,
            variables.storyConnectionKey,
            variables.tag
          );
          return;
        }
        throw new Error(
          `Unsupport new top level comment live updates for sort ${variables.orderBy}`
        );
      },
    })
);

export default CommentEnteredSubscription;
