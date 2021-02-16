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

import { LiveCommentEnteredSubscription } from "coral-stream/__generated__/LiveCommentEnteredSubscription.graphql";

import { isPublished } from "../shared/helpers";

function insertComment(
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

  const edge = ConnectionHandler.createEdge(store, comment, comment, "");

  if (connection) {
    ConnectionHandler.insertEdgeAfter(connection, edge);
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
          // TODO: figure out how replies work in chat first
          return;
        } else {
          insertComment(
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
