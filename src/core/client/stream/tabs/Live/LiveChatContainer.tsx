import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";
import { Virtuoso } from "react-virtuoso";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  useLocal,
  useSubscription,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import {
  GQLCOMMENT_SORT,
  GQLSTORY_STATUS,
  GQLUSER_STATUS,
} from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import {
  LiveChatLoadAfterEvent,
  LiveChatLoadBeforeEvent,
  LiveChatOpenConversationEvent,
  LiveJumpToCommentEvent,
  LiveJumpToNewestEvent,
  LiveStartTailingEvent,
  LiveStopTailingEvent,
} from "coral-stream/events";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { LiveChatContainer_settings } from "coral-stream/__generated__/LiveChatContainer_settings.graphql";
import { LiveChatContainer_story } from "coral-stream/__generated__/LiveChatContainer_story.graphql";
import { LiveChatContainer_viewer } from "coral-stream/__generated__/LiveChatContainer_viewer.graphql";
import { LiveChatContainerAfterCommentEdge } from "coral-stream/__generated__/LiveChatContainerAfterCommentEdge.graphql";
import { LiveChatContainerBeforeCommentEdge } from "coral-stream/__generated__/LiveChatContainerBeforeCommentEdge.graphql";
import { LiveChatContainerLocal } from "coral-stream/__generated__/LiveChatContainerLocal.graphql";
import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";

import CursorState from "./cursorState";
import LiveCommentContainer from "./LiveComment";
import LiveCommentEnteredSubscription from "./LiveCommentEnteredSubscription";
import LiveCommentConversationContainer from "./LiveCommentReply/LiveCommentConversationContainer";
import LivePostCommentFormContainer from "./LivePostCommentFormContainer";
import LiveSkeleton from "./LiveSkeleton";

import styles from "./LiveChatContainer.css";

interface ConversationViewState {
  visible: boolean;
  comment?:
    | PropTypesOf<typeof LiveCommentConversationContainer>["comment"]
    | null;
  type?: "conversation" | "parent" | "reply" | "replyToParent";
}

interface Props {
  beforeComments: LiveChatContainerBeforeCommentEdge;
  beforeHasMore: boolean;
  loadMoreBefore: () => Promise<void>;
  isLoadingMoreBefore: boolean;

  afterComments: LiveChatContainerAfterCommentEdge;
  afterHasMore: boolean;
  loadMoreAfter: () => Promise<void>;
  isLoadingMoreAfter: boolean;

  viewer: LiveChatContainer_viewer | null;
  settings: LiveChatContainer_settings;
  story: LiveChatContainer_story;

  setCursor: (cursor: string) => void;
}

interface NewComment {
  id: string;
  cursor: string;
}

const START_INDEX = 100000;
const OVERSCAN = { main: 500, reverse: 500 };
const LiveChatContainer: FunctionComponent<Props> = ({
  beforeComments,
  beforeHasMore,
  loadMoreBefore,
  isLoadingMoreBefore,
  afterComments,
  afterHasMore,
  loadMoreAfter,
  isLoadingMoreAfter,
  viewer,
  settings,
  story,
  setCursor,
}) => {
  const context = useCoralContext();
  const [
    {
      storyID,
      storyURL,
      liveChat: { tailing },
    },
    setLocal,
  ] = useLocal<LiveChatContainerLocal>(graphql`
    fragment LiveChatContainerLocal on Local {
      storyID
      storyURL
      liveChat {
        tailing
      }
    }
  `);

  const banned = !!viewer?.status.current.includes(GQLUSER_STATUS.BANNED);
  const suspended = !!viewer?.status.current.includes(GQLUSER_STATUS.SUSPENDED);
  const warned = !!viewer?.status.current.includes(GQLUSER_STATUS.WARNED);

  const showCommentForm = !banned && !suspended && !warned;
  const [conversationView, setConversationView] = useState<
    ConversationViewState
  >({
    visible: false,
  });

  const [
    newlyPostedComment,
    setNewlyPostedComment,
  ] = useState<NewComment | null>(null);

  const setTailing = useCallback(
    (value: boolean) => {
      setLocal({ liveChat: { tailing: value } });

      if (value) {
        LiveStartTailingEvent.emit(context.eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      } else {
        LiveStopTailingEvent.emit(context.eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      }
    },
    [context.eventEmitter, setLocal, story.id, viewer]
  );

  const subscribeToCommentEntered = useSubscription(
    LiveCommentEnteredSubscription
  );

  useEffect(() => {
    // There is no need for checking tailing here.
    if (afterHasMore) {
      return;
    }
    const disposable = subscribeToCommentEntered({ storyID: story.id });

    return () => {
      disposable.dispose();
    };
  }, [story.id, subscribeToCommentEntered, afterHasMore]);

  const handleCommentVisible = useCallback(
    async (visible: boolean, id: string, createdAt: string, cursor: string) => {
      if (!visible) {
        return;
      }
      // Set the constant updating cursor
      const key = `liveCursor:${storyID}:${storyURL}`;

      const rawValue = await context.sessionStorage.getItem(key);
      let current: CursorState | null = null;
      if (rawValue) {
        current = JSON.parse(rawValue);
      }

      if (
        !current ||
        (current && new Date(createdAt) > new Date(current.createdAt))
      ) {
        await context.sessionStorage.setItem(
          key,
          JSON.stringify({
            createdAt,
            cursor,
          })
        );
      }

      // Hide the "Jump to new comment" button if we can see its target comment
      if (newlyPostedComment && newlyPostedComment.id === id) {
        setNewlyPostedComment(null);
      }
    },
    [context.sessionStorage, newlyPostedComment, storyID, storyURL]
  );

  const showConversation = useCallback(
    (
      comment:
        | LiveCommentContainer_comment
        | NonNullable<LiveCommentContainer_comment["parent"]>,
      type: Required<ConversationViewState>["type"]
    ) => {
      LiveChatOpenConversationEvent.emit(context.eventEmitter, {
        storyID: story.id,
        commentID: comment.id,
        viewerID: viewer ? viewer.id : "",
        type,
      });

      setConversationView({
        visible: true,
        comment,
        type,
      });
    },
    [context.eventEmitter, story.id, viewer]
  );

  const handleReplyToComment = useCallback(
    (comment: LiveCommentContainer_comment) => {
      showConversation(comment, "reply");
    },
    [showConversation]
  );
  const handleReplyToParent = useCallback(
    (parent: NonNullable<LiveCommentContainer_comment["parent"]>) => {
      showConversation(parent, "replyToParent");
    },
    [showConversation]
  );

  const handleShowConversation = useCallback(
    (comment: LiveCommentContainer_comment) => {
      showConversation(comment, "conversation");
    },
    [showConversation]
  );

  const handleShowParentConversation = useCallback(
    (parent: NonNullable<LiveCommentContainer_comment["parent"]>) => {
      showConversation(parent, "parent");
    },
    [showConversation]
  );

  const handleCloseConversation = useCallback(() => {
    setConversationView({
      visible: false,
      comment: null,
    });
  }, [setConversationView]);

  const jumpToComment = useCallback(() => {
    if (!newlyPostedComment) {
      return;
    }

    setCursor(newlyPostedComment.cursor);

    LiveJumpToCommentEvent.emit(context.eventEmitter, {
      storyID: story.id,
      commentID: newlyPostedComment.id,
      viewerID: viewer ? viewer.id : "",
    });
  }, [newlyPostedComment, setCursor, story.id, viewer, context.eventEmitter]);

  const handleCommentSubmitted = useCallback(
    (commentID: string, cursor: string) => {
      if (!commentID || !cursor) {
        return;
      }

      if (!tailing && !newlyPostedComment) {
        setNewlyPostedComment({ id: commentID, cursor });
      }
    },
    [tailing, newlyPostedComment]
  );

  const closeJumpToComment = useCallback(() => {
    if (!newlyPostedComment) {
      return;
    }

    setNewlyPostedComment(null);
  }, [newlyPostedComment, setNewlyPostedComment]);

  const jumpToLive = useCallback(() => {
    setCursor(new Date().toISOString());

    LiveJumpToNewestEvent.emit(context.eventEmitter, {
      storyID: story.id,
      viewerID: viewer ? viewer.id : "",
    });
  }, [context.eventEmitter, story.id, viewer, setCursor]);

  // Render an item or a loading indicator.
  const itemContent = useCallback(
    (index) => {
      index = index - (START_INDEX - beforeComments.length);
      if (index < 0) {
        throw new Error(`Unexpected index < 0, was '${index}'`);
      }
      if (index < beforeComments.length) {
        const e = beforeComments[index];
        return (
          <div>
            {index === 0 && isLoadingMoreBefore && <LiveSkeleton />}
            <LiveCommentContainer
              key={e.node.id}
              story={story}
              comment={e.node}
              cursor={e.cursor}
              viewer={viewer}
              settings={settings}
              onInView={handleCommentVisible}
              onShowConversation={handleShowConversation}
              onShowParentConversation={handleShowParentConversation}
              onReplyToComment={handleReplyToComment}
              onReplyToParent={handleReplyToParent}
            />
          </div>
        );
      } else if (index < beforeComments.length + afterComments.length) {
        let marker: React.ReactElement | null = null;
        if (index === beforeComments.length) {
          marker = (
            <div id="before-after" style={{ minHeight: "1px" }}>
              {afterComments && afterComments.length > 0 && (
                <Flex justifyContent="center" alignItems="center">
                  <hr className={styles.newhr} />
                  <div className={styles.newDiv}>
                    New <Icon size="md">arrow_downward</Icon>
                  </div>
                  <hr className={styles.newhr} />
                </Flex>
              )}
            </div>
          );
        }
        const e = afterComments[index - beforeComments.length];
        return (
          <div>
            {marker}
            <LiveCommentContainer
              key={e.node.id}
              story={story}
              comment={e.node}
              cursor={e.cursor}
              viewer={viewer}
              settings={settings}
              onInView={handleCommentVisible}
              onShowConversation={handleShowConversation}
              onShowParentConversation={handleShowParentConversation}
              onReplyToComment={handleReplyToComment}
              onReplyToParent={handleReplyToParent}
            />
          </div>
        );
      } else if (index === beforeComments.length + afterComments.length) {
        return <LiveSkeleton />;
      } else {
        throw new Error(`Index out of bounds: ${index}`);
      }
    },
    [
      afterComments,
      beforeComments,
      isLoadingMoreBefore,
      handleCommentVisible,
      handleReplyToComment,
      handleReplyToParent,
      handleShowConversation,
      handleShowParentConversation,
      settings,
      story,
      viewer,
    ]
  );

  const handleAtTopStateChange = useCallback(
    (atTop: boolean) => {
      if (atTop && beforeHasMore && !isLoadingMoreBefore) {
        void loadMoreBefore();
        LiveChatLoadBeforeEvent.emit(context.eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      }
    },
    [
      beforeHasMore,
      context.eventEmitter,
      isLoadingMoreBefore,
      loadMoreBefore,
      story.id,
      viewer,
    ]
  );
  const handleAtBottomStateChange = useCallback(
    (atBottom: boolean) => {
      if (atBottom && afterHasMore && !isLoadingMoreAfter) {
        void loadMoreAfter();
        LiveChatLoadAfterEvent.emit(context.eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      }
      setTailing(atBottom);
    },
    [
      afterHasMore,
      context.eventEmitter,
      isLoadingMoreAfter,
      loadMoreAfter,
      setTailing,
      story.id,
      viewer,
    ]
  );
  return (
    <div className={styles.root}>
      <div className={styles.filler}></div>
      {story.status === GQLSTORY_STATUS.OPEN &&
        afterComments.length === 0 &&
        beforeComments.length === 0 && (
          <Localized id="comments-noCommentsYet">
            <CallOut color="primary">
              There are no comments yet. Why don't you write one?
            </CallOut>
          </Localized>
        )}
      {story.status === GQLSTORY_STATUS.CLOSED &&
        afterComments.length === 0 &&
        beforeComments.length === 0 && (
          <Localized id="comments-noCommentsAtAll">
            <CallOut color="mono">There are no comments on this story.</CallOut>
          </Localized>
        )}
      <Virtuoso
        firstItemIndex={START_INDEX - beforeComments.length}
        id="live-chat-comments"
        className={styles.streamContainer}
        totalCount={
          beforeComments.length +
          afterComments.length +
          (isLoadingMoreAfter ? 1 : 0)
        }
        initialTopMostItemIndex={Math.max(beforeComments.length - 1, 0)}
        itemContent={itemContent}
        alignToBottom
        followOutput="smooth"
        overscan={OVERSCAN}
        atTopStateChange={handleAtTopStateChange}
        atBottomStateChange={handleAtBottomStateChange}
      />

      {/* TODO: Refactoring canditate */}
      {newlyPostedComment && (
        <div className={styles.jumpToContainer}>
          <Flex justifyContent="center" alignItems="center">
            <Flex alignItems="center">
              <Button
                onClick={jumpToComment}
                color="primary"
                className={styles.jumpToReplyButton}
              >
                Message posted below <Icon>arrow_downward</Icon>
              </Button>
              <Button
                onClick={closeJumpToComment}
                color="primary"
                aria-valuetext="close"
                className={styles.jumpToReplyButtonClose}
              >
                <Icon>close</Icon>
              </Button>
            </Flex>
          </Flex>
        </div>
      )}
      {/* TODO: Refactoring canditate */}
      {!newlyPostedComment && !tailing && afterHasMore && (
        <div className={styles.jumpToContainer}>
          <Flex justifyContent="center" alignItems="center">
            <Flex alignItems="center">
              <Button
                onClick={jumpToLive}
                color="primary"
                className={styles.jumpButton}
              >
                Jump to live <Icon>arrow_downward</Icon>
              </Button>
            </Flex>
          </Flex>
        </div>
      )}
      {conversationView.visible && conversationView.comment && (
        <LiveCommentConversationContainer
          settings={settings}
          viewer={viewer}
          story={story}
          comment={conversationView.comment}
          visible={conversationView.visible}
          onClose={handleCloseConversation}
        />
      )}
      {showCommentForm && (
        <LivePostCommentFormContainer
          settings={settings}
          story={story}
          viewer={viewer}
          commentsOrderBy={GQLCOMMENT_SORT.CREATED_AT_ASC}
          onSubmitted={handleCommentSubmitted}
        />
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  beforeComments: graphql`
    fragment LiveChatContainerBeforeCommentEdge on CommentEdge
      @relay(plural: true) {
      cursor
      node {
        id
        ...LiveCommentContainer_comment
      }
    }
  `,
  afterComments: graphql`
    fragment LiveChatContainerAfterCommentEdge on CommentEdge
      @relay(plural: true) {
      cursor
      node {
        id
        ...LiveCommentContainer_comment
      }
    }
  `,
  story: graphql`
    fragment LiveChatContainer_story on Story {
      id
      url
      status
      ...LivePostCommentFormContainer_story
      ...LiveCommentConversationContainer_story
      ...LiveCommentContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveChatContainer_viewer on User {
      id
      status {
        current
      }
      ...LivePostCommentFormContainer_viewer
      ...LiveCommentContainer_viewer
      ...LiveCommentConversationContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveChatContainer_settings on Settings {
      ...LivePostCommentFormContainer_settings
      ...LiveCommentContainer_settings
      ...LiveCommentConversationContainer_settings
    }
  `,
})(LiveChatContainer);

export default enhanced;
