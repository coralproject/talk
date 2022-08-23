import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import {
  createSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLCOMMENT_SORT_RL } from "coral-framework/schema";
import { MAX_REPLY_INDENT_DEPTH } from "coral-stream/constants";

import { CommentEnteredSubscription } from "coral-stream/__generated__/CommentEnteredSubscription.graphql";

import {
  determineDepthTillAncestor,
  determineDepthTillStory,
  getFlattenedReplyAncestorID,
  getReplyAncestorID,
  lookupFlattenReplies,
} from "../../helpers";

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

  // QUESTION: connection here was undefined when using the RR review/question tabs
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

function insertReply(
  store: RecordSourceSelectorProxy<unknown>,
  liveDirectRepliesInsertion: boolean,
  flattenReplies: boolean,
  storyID: string,
  storyConnectionKey: string,
  orderBy?: GQLCOMMENT_SORT_RL,
  tag?: string,
  ancestorID?: string | null
) {
  const comment = store
    .getRootField("commentEntered")!
    .getLinkedRecord("comment")!;

  if (!ancestorID && !orderBy) {
    throw new Error("orderBy not set");
  }

  const depth = ancestorID
    ? determineDepthTillAncestor(store, comment, ancestorID)
    : determineDepthTillStory(
        store,
        comment,
        storyID,
        orderBy!,
        storyConnectionKey,
        tag
      );

  if (depth === null) {
    // could not trace back to ancestor, discard.
    return;
  }

  const outsideOfView = depth >= MAX_REPLY_INDENT_DEPTH;
  let parentID = comment.getLinkedRecord("parent")!.getValue("id")! as string;
  let parentProxy = store.get(parentID)!;

  if (outsideOfView) {
    if (!flattenReplies) {
      // Inform last comment in visible tree about the available replies.
      // This will trigger to show the `Read More of this Conversation` link.
      const replyCount = (parentProxy.getValue("replyCount") as number) || 0;
      parentProxy.setValue(replyCount + 1, "replyCount");
      return;
    }
    // In flatten replies we change the parent to the last level ancestor.
    parentID = getFlattenedReplyAncestorID(comment, depth)! as string;
    parentProxy = store.get(parentID)!;
  }

  const connection = ConnectionHandler.getConnection(
    parentProxy,
    "ReplyList_replies",
    { orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC }
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

  // This adds the new reply to the allChildComments for the root-level ancestor
  // comment of the reply. This enables the new reply to be found as a next
  // unseen comment by keyboard shortcuts.
  const replyAncestorID =
    ancestorID || (getReplyAncestorID(comment, depth) as string);
  const ancestorProxy = store.get(replyAncestorID);
  const allChildCommentsAncestor = ancestorProxy?.getOrCreateLinkedRecord(
    "allChildComments",
    "allChildComments",
    []
  );
  if (allChildCommentsAncestor) {
    const allChildEdges =
      allChildCommentsAncestor.getLinkedRecords("edges") || [];
    allChildCommentsAncestor.setLinkedRecords(
      allChildEdges.concat(commentsEdge),
      "edges"
    );
  }
}

type CommentEnteredVariables = Omit<
  SubscriptionVariables<CommentEnteredSubscription>,
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

const CommentEnteredSubscription = createSubscription(
  "subscribeToCommentEntered",
  (environment: Environment, variables: CommentEnteredVariables) => ({
    subscription: graphql`
      subscription CommentEnteredSubscription(
        $storyID: ID!
        $ancestorID: ID
        $flattenReplies: Boolean!
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
            ...AllCommentsTabCommentContainer_comment
          }
        }
      }
    `,
    variables: {
      storyID: variables.storyID,
      ancestorID: variables.ancestorID,
      flattenReplies: lookupFlattenReplies(environment),
    },
    updater: (store) => {
      const rootField = store.getRootField("commentEntered");
      if (!rootField) {
        return;
      }

      const flattenReplies = lookupFlattenReplies(environment);
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
          flattenReplies,
          variables.storyID,
          variables.storyConnectionKey,
          variables.orderBy,
          variables.tag,
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
