import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  LOCAL_ID,
  lookup,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";
import { isPublished } from "coral-stream/tabs/shared/helpers";

import { LiveReplyCommentEnteredSubscription } from "coral-stream/__generated__/LiveReplyCommentEnteredSubscription.graphql";
import insertReplyToAncestor from "../helpers/insertReplyToAncestor";

function liveInsertionEnabled(environment: Environment): boolean {
  const liveChat = lookup(environment, LOCAL_ID).liveChat;

  return liveChat.tailingConversation;
}

type CommentEnteredVariables = Omit<
  SubscriptionVariables<LiveReplyCommentEnteredSubscription>,
  "flattenReplies"
>;

const LiveReplyCommentEnteredSubscription = createSubscription(
  "subscribeToCommentEntered",
  (environment: Environment, variables: CommentEnteredVariables) => {
    return requestSubscription(environment, {
      subscription: graphql`
        subscription LiveReplyCommentEnteredSubscription(
          $storyID: ID!
          $ancestorID: ID!
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

        const status = comment.getValue("status");
        // If comment is not visible, we don't need to add it.
        if (!isPublished(status)) {
          return;
        }
        comment.setValue(true, "enteredLive");

        insertReplyToAncestor(store, variables.ancestorID, comment, {
          liveInsertion: liveInsertionEnabled(environment),
          fromMutation: false,
        });
      },
    });
  }
);

export default LiveReplyCommentEnteredSubscription;
