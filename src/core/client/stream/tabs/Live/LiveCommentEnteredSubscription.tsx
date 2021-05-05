import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createSubscription,
  LOCAL_ID,
  lookup,
  requestSubscription,
  SubscriptionVariables,
} from "coral-framework/lib/relay";

import { LiveCommentEnteredSubscription } from "coral-stream/__generated__/LiveCommentEnteredSubscription.graphql";

import { isPublished } from "../shared/helpers";
import handleNewCommentInStory from "./helpers/handleNewCommentInStory";
import handleNewReplyInConversation from "./helpers/handleNewReplyInConversation";

function getLiveMainStreamInsertionEnabled(environment: Environment): boolean {
  const liveChat = lookup(environment, LOCAL_ID).liveChat;

  return liveChat.tailing;
}

function getLiveConversationInsertionEnabled(
  environment: Environment
): boolean {
  const liveChat = lookup(environment, LOCAL_ID).liveChat;

  return liveChat.tailingConversation;
}

function getConversationRootCommentID(environment: Environment): string | null {
  const liveChat = lookup(environment, LOCAL_ID).liveChat;

  return liveChat.conversationRootCommentID;
}

type CommentEnteredVariables = Omit<
  SubscriptionVariables<LiveCommentEnteredSubscription>,
  "flattenReplies"
>;

const LiveCommentEnteredSubscription = createSubscription(
  "subscribeToCommentEntered",
  (environment: Environment, variables: CommentEnteredVariables) => {
    return requestSubscription(environment, {
      subscription: graphql`
        subscription LiveCommentEnteredSubscription($storyID: ID!) {
          commentEntered(storyID: $storyID) {
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

        comment.setValue(true, "enteredLive");
        handleNewCommentInStory(store, variables.storyID, comment, {
          liveInsertion: getLiveMainStreamInsertionEnabled(environment),
        });

        const convRootCommentID = getConversationRootCommentID(environment);
        if (convRootCommentID) {
          handleNewReplyInConversation(store, convRootCommentID, comment, {
            liveInsertion: getLiveConversationInsertionEnabled(environment),
          });
        }
      },
    });
  }
);

export default LiveCommentEnteredSubscription;
