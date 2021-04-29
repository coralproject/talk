import { EventEmitter2 } from "eventemitter2";
import { useCallback, useState } from "react";
import { RecordProxy } from "relay-runtime";

import { DeepPartial } from "coral-common/types";
import {
  LiveChatOpenConversationEvent,
  LiveChatOpenParentEvent,
  LiveChatOpenReplyEvent,
  LiveChatOpenReplyToParentEvent,
} from "coral-stream/events";

import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";

export interface HighlightedComment {
  id: string;
  cursor: string;
}

export interface ConversationViewState {
  visible: boolean;
  comment?:
    | LiveCommentContainer_comment
    | NonNullable<LiveCommentContainer_comment["parent"]>
    | null;
  type?: "conversation" | "parent" | "reply" | "replyToParent";
  highlightedComment?: HighlightedComment;
}

export interface ShowConversationOptions {
  highlight?:
    | LiveCommentContainer_comment
    | NonNullable<LiveCommentContainer_comment["parent"]>;
}

const useConversation = (
  eventEmitter: EventEmitter2,
  setLocal: (update: DeepPartial<any> | ((record: RecordProxy) => void)) => void
): [
  ConversationViewState,
  (
    comment:
      | LiveCommentContainer_comment
      | NonNullable<LiveCommentContainer_comment["parent"]>,
    storyID: string,
    viewerID: string,
    type?: "conversation" | "parent" | "reply" | "replyToParent",
    options?: ShowConversationOptions
  ) => void,
  () => void
] => {
  const [conversationState, setConversationState] = useState<
    ConversationViewState
  >({
    visible: false,
  });

  const showConversation = useCallback(
    (
      comment:
        | LiveCommentContainer_comment
        | NonNullable<LiveCommentContainer_comment["parent"]>,
      storyID: string,
      viewerID: string,
      type?: "conversation" | "parent" | "reply" | "replyToParent",
      options?: ShowConversationOptions
    ) => {
      if (type === "conversation") {
        LiveChatOpenConversationEvent.emit(eventEmitter, {
          storyID,
          commentID: comment.id,
          viewerID,
        });
      } else if (type === "parent") {
        LiveChatOpenParentEvent.emit(eventEmitter, {
          storyID,
          commentID: comment.id,
          viewerID,
        });
      } else if (type === "reply") {
        LiveChatOpenReplyEvent.emit(eventEmitter, {
          storyID,
          commentID: comment.id,
          viewerID,
        });
      } else if (type === "replyToParent") {
        LiveChatOpenReplyToParentEvent.emit(eventEmitter, {
          storyID,
          commentID: comment.id,
          viewerID,
        });
      }

      setConversationState({
        visible: true,
        comment,
        type,
        highlightedComment:
          options && options.highlight
            ? {
                id: options.highlight.id,
                cursor: options.highlight.createdAt,
              }
            : undefined,
      });
      setLocal({ liveChat: { conversationRootCommentID: comment.id } });
    },
    [eventEmitter, setLocal]
  );

  const hideConversation = useCallback(() => {
    setConversationState({
      visible: false,
      comment: null,
    });
  }, []);

  return [conversationState, showConversation, hideConversation];
};

export default useConversation;
