import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { graphql } from "react-relay";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  useLocal,
  useSubscription,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLSTORY_STATUS, GQLUSER_STATUS } from "coral-framework/schema";
import { VIEWER_STATUS_CONTAINER_ID } from "coral-stream/constants";
import {
  LiveChatGoToStartEvent,
  LiveChatJumpToCommentEvent,
  LiveChatJumpToLiveEvent,
  LiveChatJumpToNewEvent,
  LiveChatLoadAfterEvent,
  LiveChatLoadBeforeEvent,
  LiveChatStartTailingEvent,
  LiveChatStopTailingEvent,
  LiveChatSubmitCommentWhenNotTailingEvent,
} from "coral-stream/events";
import BannedInfo from "coral-stream/tabs/Comments/Stream/BannedInfo";
import { SuspendedInfoContainer } from "coral-stream/tabs/Comments/Stream/SuspendedInfo";
import WarningContainer from "coral-stream/tabs/Comments/Stream/Warning/WarningContainer";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { LiveChatContainer_settings } from "coral-stream/__generated__/LiveChatContainer_settings.graphql";
import { LiveChatContainer_story } from "coral-stream/__generated__/LiveChatContainer_story.graphql";
import { LiveChatContainer_viewer } from "coral-stream/__generated__/LiveChatContainer_viewer.graphql";
import { LiveChatContainerAfterCommentEdge } from "coral-stream/__generated__/LiveChatContainerAfterCommentEdge.graphql";
import { LiveChatContainerBeforeCommentEdge } from "coral-stream/__generated__/LiveChatContainerBeforeCommentEdge.graphql";
import { LiveChatContainerLocal } from "coral-stream/__generated__/LiveChatContainerLocal.graphql";
import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";

import { getLatestCursorState, persistLatestCursorState } from "./cursorState";
import useColdStart from "./helpers/useColdStart";
import InView from "./InView";
import JumpToButton from "./JumpToButton";
import LiveCommentContainer from "./LiveComment";
import { CommentPosition } from "./LiveComment/LiveCommentContainer";
import LiveCommentEditedSubscription from "./LiveCommentEditedSubscription";
import LiveCommentEnteredSubscription from "./LiveCommentEnteredSubscription";
import LiveCommentRejectedSubscription from "./LiveCommentRejectedSubscription";
import { LiveConversationQuery } from "./LiveConversation";
import useConversation from "./LiveConversation/useConversation";
import LiveEditCommentFormContainer from "./LiveEditComment/LiveEditCommentFormContainer";
import LivePostCommentFormContainer from "./LivePostCommentFormContainer";
import LiveSkeleton from "./LiveSkeleton";

import styles from "./LiveChatContainer.css";

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

  cursor: string;
  setCursor: (cursor: string) => void;
}

interface NewComment {
  id: string;
  cursor: string;
}

interface EditingCommentViewState {
  visible: boolean;
  comment: LiveCommentContainer_comment;
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
  const { localStorage, eventEmitter } = useCoralContext();
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

  const virtuoso = useRef<VirtuosoHandle | null>(null);

  const banned = !!viewer?.status.current.includes(GQLUSER_STATUS.BANNED);
  const suspended = !!viewer?.status.current.includes(GQLUSER_STATUS.SUSPENDED);
  const warned = !!viewer?.status.current.includes(GQLUSER_STATUS.WARNED);

  const noComments = afterComments.length === 0 && beforeComments.length === 0;

  const showCommentForm = !banned && !suspended && !warned;
  const [
    conversationState,
    showConversation,
    hideConversation,
  ] = useConversation();

  const [
    newlyPostedComment,
    setNewlyPostedComment,
  ] = useState<NewComment | null>(null);

  const mostRecentViewedCursor = useRef<string | null>(null);
  const [
    mostRecentViewedPosition,
    setMostRecentViewedPosition,
  ] = useState<CommentPosition | null>(null);
  const [cursorInView, setCursorInView] = useState<boolean>(false);

  const [
    editingComment,
    setEditingComment,
  ] = useState<EditingCommentViewState | null>(null);

  const setTailing = useCallback(
    (value: boolean) => {
      setLocal({ liveChat: { tailing: value } });

      if (value) {
        LiveChatStartTailingEvent.emit(eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      } else {
        LiveChatStopTailingEvent.emit(eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      }
    },
    [eventEmitter, setLocal, story.id, viewer]
  );

  // We define a period at the beginning as cold start, where
  // different state might not yet be stable.
  const coldStart = useColdStart();

  const subscribeToCommentEntered = useSubscription(
    LiveCommentEnteredSubscription
  );

  useEffect(() => {
    const disposable = subscribeToCommentEntered({ storyID: story.id });

    return () => {
      disposable.dispose();
    };
  }, [story.id, subscribeToCommentEntered, afterHasMore]);

  const subscribeToCommentEdited = useSubscription(
    LiveCommentEditedSubscription
  );
  const subscribeToCommentRejected = useSubscription(
    LiveCommentRejectedSubscription
  );
  useEffect(() => {
    const editedDisposable = subscribeToCommentEdited({ storyID: story.id });
    const rejectedDisposable = subscribeToCommentRejected({
      storyID: story.id,
    });

    return () => {
      editedDisposable.dispose();
      rejectedDisposable.dispose();
    };
  }, [story.id, subscribeToCommentEdited, subscribeToCommentRejected]);

  const handleCommentVisible = useCallback(
    async (
      visible: boolean,
      id: string,
      createdAt: string,
      cursor: string,
      position: CommentPosition
    ) => {
      if (!visible) {
        return;
      }

      const latestCursorState = await getLatestCursorState(
        localStorage,
        storyID,
        storyURL
      );

      if (
        !latestCursorState ||
        !latestCursorState.cursor ||
        (latestCursorState &&
          latestCursorState.cursor &&
          new Date(createdAt) > new Date(latestCursorState.cursor))
      ) {
        await persistLatestCursorState(localStorage, storyID, storyURL, {
          cursor,
          createdAt,
        });
      }

      mostRecentViewedCursor.current = createdAt;
      setMostRecentViewedPosition(position);

      // Hide the "Jump to new comment" button if we can see its target comment
      if (newlyPostedComment && newlyPostedComment.id === id) {
        setNewlyPostedComment(null);
      }
    },
    [localStorage, newlyPostedComment, storyID, storyURL]
  );

  const handleReplyToComment = useCallback(
    (comment: LiveCommentContainer_comment) => {
      showConversation(comment, story.id, viewer ? viewer.id : "", "reply");
    },
    [showConversation, story.id, viewer]
  );
  const handleReplyToParent = useCallback(
    (
      parent: NonNullable<LiveCommentContainer_comment["parent"]>,
      comment: LiveCommentContainer_comment
    ) => {
      showConversation(
        parent,
        story.id,
        viewer ? viewer.id : "",
        "replyToParent",
        {
          highlight: comment,
        }
      );
    },
    [showConversation, story.id, viewer]
  );

  const handleShowConversation = useCallback(
    (comment: LiveCommentContainer_comment) => {
      showConversation(
        comment,
        story.id,
        viewer ? viewer.id : "",
        "conversation"
      );
    },
    [showConversation, story.id, viewer]
  );

  const handleShowParentConversation = useCallback(
    (parent: NonNullable<LiveCommentContainer_comment["parent"]>) => {
      showConversation(parent, story.id, viewer ? viewer.id : "", "parent");
    },
    [showConversation, story.id, viewer]
  );

  const handleCloseConversation = useCallback(() => {
    hideConversation();
  }, [hideConversation]);

  const jumpToComment = useCallback(() => {
    if (!newlyPostedComment) {
      return;
    }

    setCursor(newlyPostedComment.cursor);

    LiveChatJumpToCommentEvent.emit(eventEmitter, {
      storyID: story.id,
      commentID: newlyPostedComment.id,
      viewerID: viewer ? viewer.id : "",
    });
  }, [newlyPostedComment, setCursor, story.id, viewer, eventEmitter]);

  const handleCommentSubmitted = useCallback(
    (commentID: string, cursor: string) => {
      if (!commentID || !cursor) {
        return;
      }

      if (!tailing) {
        setNewlyPostedComment({ id: commentID, cursor });

        LiveChatSubmitCommentWhenNotTailingEvent.emit(eventEmitter, {
          storyID: story.id,
          commentID,
          viewerID: viewer ? viewer.id : "",
        });
      }
    },
    [eventEmitter, story.id, tailing, viewer]
  );

  const closeJumpToComment = useCallback(() => {
    if (!newlyPostedComment) {
      return;
    }

    setNewlyPostedComment(null);
  }, [newlyPostedComment, setNewlyPostedComment]);

  const handleGoToStart = useCallback(() => {
    setCursor(new Date(0).toISOString());

    LiveChatGoToStartEvent.emit(eventEmitter, {
      storyID: story.id,
      viewerID: viewer ? viewer.id : "",
    });
  }, [eventEmitter, setCursor, story.id, viewer]);

  const jumpToNew = useCallback(() => {
    if (!virtuoso.current) {
      throw new Error("Virtuoso ref was null");
    }
    virtuoso.current.scrollToIndex({
      align: "center",
      index: beforeComments.length,
      behavior: "smooth",
    });

    LiveChatJumpToNewEvent.emit(eventEmitter, {
      storyID: story.id,
      viewerID: viewer ? viewer.id : "",
    });
  }, [beforeComments.length, eventEmitter, story.id, viewer]);

  const jumpToLive = useCallback(() => {
    setCursor(new Date().toISOString());

    LiveChatJumpToLiveEvent.emit(eventEmitter, {
      storyID: story.id,
      viewerID: viewer ? viewer.id : "",
    });
  }, [eventEmitter, story.id, viewer, setCursor]);

  const handleOnEdit = useCallback((comment: LiveCommentContainer_comment) => {
    setEditingComment({ comment, visible: true });
  }, []);
  const handleOnCloseEdit = useCallback(() => {
    setEditingComment(null);
  }, [setEditingComment]);
  const handleRefreshSettingsFromEdit = useCallback(
    async (refreshSettings: { storyID: string }) => {
      // TODO: implement refresh settings.
    },
    []
  );
  const handleCancelEdit = useCallback(() => {
    setEditingComment(null);
  }, []);

  const onCursorInView = useCallback((visible: boolean) => {
    setCursorInView(visible);
  }, []);

  const scrollStreamToID = useCallback((id: string) => {
    if (!virtuoso || !virtuoso.current) {
      return;
    }

    const el = document.getElementById(id);
    if (!el) {
      return;
    }

    virtuoso.current.scrollTo({ left: 0, top: el.offsetTop });
  }, []);

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
              onEdit={handleOnEdit}
              editing={
                !!(
                  editingComment &&
                  editingComment.visible &&
                  editingComment.comment.id === e.node.id
                )
              }
              onCancelEditing={handleCancelEdit}
              position={CommentPosition.Before}
              scrollParentToID={scrollStreamToID}
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
                  <InView onInView={onCursorInView} />
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
              onEdit={handleOnEdit}
              editing={
                !!(
                  editingComment &&
                  editingComment.visible &&
                  editingComment.comment.id === e.node.id
                )
              }
              onCancelEditing={handleCancelEdit}
              position={CommentPosition.After}
              scrollParentToID={scrollStreamToID}
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
      beforeComments,
      afterComments,
      isLoadingMoreBefore,
      story,
      viewer,
      settings,
      handleCommentVisible,
      handleShowConversation,
      handleShowParentConversation,
      handleReplyToComment,
      handleReplyToParent,
      handleOnEdit,
      editingComment,
      handleCancelEdit,
      scrollStreamToID,
      onCursorInView,
    ]
  );

  const handleAtTopStateChange = useCallback(
    (atTop: boolean) => {
      if (atTop && beforeHasMore && !isLoadingMoreBefore) {
        // TODO: (cvle) Better load more UX.
        void loadMoreBefore();
        LiveChatLoadBeforeEvent.emit(eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      }
    },
    [
      beforeHasMore,
      eventEmitter,
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
        LiveChatLoadAfterEvent.emit(eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      }
      setTailing(atBottom && !afterHasMore);
    },
    [
      afterHasMore,
      eventEmitter,
      isLoadingMoreAfter,
      loadMoreAfter,
      setTailing,
      story.id,
      viewer,
    ]
  );
  return (
    <>
      {(banned || warned || suspended) && (
        <div id={VIEWER_STATUS_CONTAINER_ID} className={styles.viewerStatus}>
          {banned && <BannedInfo />}
          {suspended && (
            <SuspendedInfoContainer viewer={viewer} settings={settings} />
          )}
          {warned && <WarningContainer viewer={viewer} />}
        </div>
      )}
      <div className={styles.root}>
        <div
          className={cn(styles.filler, {
            [styles.fillerEmptyStream]: noComments,
          })}
        ></div>
        {story.status === GQLSTORY_STATUS.OPEN && noComments && (
          <Localized id="comments-noCommentsYet">
            <CallOut color="mono">
              There are no comments yet. Why don't you write one?
            </CallOut>
          </Localized>
        )}
        {story.status === GQLSTORY_STATUS.CLOSED && noComments && (
          <Localized id="comments-noCommentsAtAll">
            <CallOut color="mono">There are no comments on this story.</CallOut>
          </Localized>
        )}
        <Virtuoso
          firstItemIndex={START_INDEX - beforeComments.length}
          id="live-chat-comments"
          ref={virtuoso}
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

        {newlyPostedComment && (
          <JumpToButton onClick={jumpToComment} onCancel={closeJumpToComment}>
            Message posted below <Icon>arrow_downward</Icon>
          </JumpToButton>
        )}

        {!newlyPostedComment &&
          !tailing &&
          afterHasMore &&
          !coldStart &&
          !cursorInView &&
          (!mostRecentViewedPosition ||
            mostRecentViewedPosition === CommentPosition.Before) && (
            <JumpToButton onClick={jumpToNew}>
              New messages <Icon>arrow_downward</Icon>
            </JumpToButton>
          )}

        {((mostRecentViewedPosition &&
          mostRecentViewedPosition === CommentPosition.After) ||
          cursorInView) &&
          !newlyPostedComment &&
          !tailing &&
          !coldStart &&
          afterHasMore && (
            <JumpToButton onClick={jumpToLive}>
              Jump to live <Icon>arrow_downward</Icon>
            </JumpToButton>
          )}

        {conversationState.visible && conversationState.comment && (
          <LiveConversationQuery
            settings={settings}
            viewer={viewer}
            story={story}
            comment={conversationState.comment}
            onClose={handleCloseConversation}
            highlightedCommentState={conversationState.highlightedComment}
          />
        )}
        <div className={styles.commentForm}>
          {editingComment && editingComment.visible && (
            <LiveEditCommentFormContainer
              comment={editingComment.comment}
              story={story}
              settings={settings}
              onClose={handleOnCloseEdit}
              onRefreshSettings={handleRefreshSettingsFromEdit}
              autofocus
            />
          )}
          {!editingComment && showCommentForm && (
            <LivePostCommentFormContainer
              settings={settings}
              story={story}
              viewer={viewer}
              onSubmitted={handleCommentSubmitted}
            />
          )}
          <Flex justifyContent="flex-start">
            <Button
              onClick={handleGoToStart}
              className={styles.footerAction}
              variant="none"
              fontSize="extraSmall"
              paddingSize="extraSmall"
              underline
            >
              Go to start
            </Button>
          </Flex>
        </div>
      </div>
    </>
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
      ...LiveConversationQuery_story
      ...LiveCommentContainer_story
      ...LiveEditCommentFormContainer_story
      ...LiveCreateCommentMutation_story
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
      ...LiveConversationQuery_viewer
      ...SuspendedInfoContainer_viewer
      ...WarningContainer_viewer
      ...LiveCreateCommentMutation_viewer
    }
  `,
  settings: graphql`
    fragment LiveChatContainer_settings on Settings {
      ...LivePostCommentFormContainer_settings
      ...LiveCommentContainer_settings
      ...LiveConversationQuery_settings
      ...LiveEditCommentFormContainer_settings
      ...SuspendedInfoContainer_settings
    }
  `,
})(LiveChatContainer);

export default enhanced;
