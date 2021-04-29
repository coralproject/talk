import cn from "classnames";
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
  LiveChatJumpToReplyEvent,
  LiveChatRepliesLoadAfterEvent,
  LiveChatRepliesLoadBeforeEvent,
} from "coral-stream/events";
import { ClickOutside, Flex, Icon, Spinner } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { GQLUSER_STATUS } from "coral-framework/schema/__generated__/types";
import { LiveConversationContainer_afterComments } from "coral-stream/__generated__/LiveConversationContainer_afterComments.graphql";
import { LiveConversationContainer_beforeComments } from "coral-stream/__generated__/LiveConversationContainer_beforeComments.graphql";
import { LiveConversationContainer_comment } from "coral-stream/__generated__/LiveConversationContainer_comment.graphql";
import { LiveConversationContainer_commentDeferred } from "coral-stream/__generated__/LiveConversationContainer_commentDeferred.graphql";
import { LiveConversationContainer_settings } from "coral-stream/__generated__/LiveConversationContainer_settings.graphql";
import { LiveConversationContainer_story } from "coral-stream/__generated__/LiveConversationContainer_story.graphql";
import { LiveConversationContainer_viewer } from "coral-stream/__generated__/LiveConversationContainer_viewer.graphql";
import { LiveConversationContainerLocal } from "coral-stream/__generated__/LiveConversationContainerLocal.graphql";
import { LiveReplyContainer_comment } from "coral-stream/__generated__/LiveReplyContainer_comment.graphql";

import useColdStart from "../helpers/useColdStart";
import ShortcutIcon from "../Icons/ShortcutIcon";
import JumpToButton from "../JumpToButton";
import LiveEditCommentFormContainer from "../LiveEditComment/LiveEditCommentFormContainer";
import LiveSkeleton from "../LiveSkeleton";
import LiveCreateCommentReplyFormContainer from "./LiveCreateCommentReplyFormContainer";
import LiveReplyCommentEnteredSubscription from "./LiveReplyCommentEnteredSubscription";
import LiveReplyContainer from "./LiveReplyContainer";

import styles from "./LiveConversationContainer.css";

const START_INDEX = 100000;
const OVERSCAN = { main: 500, reverse: 500 };
interface Props {
  settings: LiveConversationContainer_settings;
  viewer: LiveConversationContainer_viewer | null;
  story: LiveConversationContainer_story;
  comment: LiveConversationContainer_comment;
  commentDeferred: LiveConversationContainer_commentDeferred | null;

  beforeComments: LiveConversationContainer_beforeComments;
  beforeHasMore: boolean;
  loadMoreBefore: () => Promise<void>;
  isLoadingMoreBefore: boolean;

  afterComments: LiveConversationContainer_afterComments;
  afterHasMore: boolean;
  loadMoreAfter: () => Promise<void>;
  isLoadingMoreAfter: boolean;

  setCursor: (cursor: string) => void;
  onClose: () => void;
  error: string;
  isLoading: boolean;

  highlightedCommentID?: string;
}

interface NewComment {
  id: string;
  cursor: string;
}

interface EditingCommentViewState {
  visible: boolean;
  comment: LiveReplyContainer_comment;
}

const LiveConversationContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
  story,
  comment,
  commentDeferred,
  onClose,
  setCursor,
  isLoading,
  error,
  beforeComments,
  afterComments,
  afterHasMore,
  beforeHasMore,
  isLoadingMoreAfter,
  isLoadingMoreBefore,
  loadMoreAfter,
  loadMoreBefore,
  highlightedCommentID,
}) => {
  const { eventEmitter } = useCoralContext();
  const [
    {
      liveChat: { tailingConversation: tailing },
    },
    setLocal,
  ] = useLocal<LiveConversationContainerLocal>(graphql`
    fragment LiveConversationContainerLocal on Local {
      liveChat {
        tailingConversation
      }
    }
  `);
  const setTailing = useCallback(
    (value: boolean) => {
      setLocal({ liveChat: { tailingConversation: value } });
    },
    [setLocal]
  );

  const banned = !!viewer?.status.current.includes(GQLUSER_STATUS.BANNED);
  const suspended = !!viewer?.status.current.includes(GQLUSER_STATUS.SUSPENDED);
  const warned = !!viewer?.status.current.includes(GQLUSER_STATUS.WARNED);

  const showReplyForm = !banned && !suspended && !warned;

  const [newlyPostedReply, setNewlyPostedReply] = useState<NewComment | null>(
    null
  );

  const close = useCallback(() => {
    setTailing(false);
    onClose();
  }, [onClose, setTailing]);

  const [
    editingComment,
    setEditingComment,
  ] = useState<EditingCommentViewState | null>(null);

  const editingCommentID = editingComment?.comment.id;

  const submit = useCallback(
    (commentID: string | undefined, cur: string) => {
      if (commentID && !tailing) {
        setNewlyPostedReply({
          id: commentID,
          cursor: cur,
        });
      }
    },
    [tailing]
  );

  const jumpToReply = useCallback(() => {
    if (newlyPostedReply && newlyPostedReply.cursor) {
      setNewlyPostedReply(null);
      setCursor(newlyPostedReply.cursor);

      LiveChatJumpToReplyEvent.emit(eventEmitter, {
        storyID: story.id,
        commentID: newlyPostedReply.id,
        viewerID: viewer ? viewer.id : "",
      });
    }
  }, [setCursor, eventEmitter, newlyPostedReply, story.id, viewer]);

  const handleJumpToLive = useCallback(() => {
    setCursor(new Date().toISOString());
  }, [setCursor]);

  const closeJumpToReply = useCallback(() => {
    if (!newlyPostedReply) {
      return;
    }

    setNewlyPostedReply(null);
  }, [newlyPostedReply, setNewlyPostedReply]);

  const handleCommentInView = useCallback(
    (commentVisible: boolean, commentID: string) => {
      if (
        commentVisible &&
        newlyPostedReply &&
        commentID === newlyPostedReply.id
      ) {
        setNewlyPostedReply(null);
      }
    },
    [newlyPostedReply]
  );

  const handleOnEdit = useCallback((c: LiveReplyContainer_comment) => {
    setEditingComment({ comment: c, visible: true });
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

  const [height, setHeight] = useState(0);
  const subscribeToCommentEntered = useSubscription(
    LiveReplyCommentEnteredSubscription
  );
  useEffect(() => {
    if (afterHasMore) {
      return;
    }
    const disposable = subscribeToCommentEntered({
      storyID: story.id,
      ancestorID: comment.id,
    });

    return () => {
      disposable.dispose();
    };
  }, [story.id, comment.id, subscribeToCommentEntered, afterHasMore]);

  const handleAtTopStateChange = useCallback(
    (atTop: boolean) => {
      if (atTop && beforeHasMore && !isLoadingMoreBefore) {
        // TODO: (cvle) Better load more UX.
        void loadMoreBefore();
        LiveChatRepliesLoadBeforeEvent.emit(eventEmitter, {
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
        LiveChatRepliesLoadAfterEvent.emit(eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      }
      setTailing(atBottom);
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

  // Render an item or a loading indicator.
  const itemContent = useCallback(
    (index) => {
      index = index - (START_INDEX - beforeComments.length);
      if (index < 0) {
        throw new Error(`Unexpected index < 0, was '${index}'`);
      }
      if (index < beforeComments.length) {
        const e = beforeComments[index];
        const isHighlighted = highlightedCommentID === e.node.id;
        const isEditing = editingCommentID === e.node.id;

        return (
          <div key={`chat-reply-${e.node.id}`} className={styles.comment}>
            <div
              className={cn(styles.body, {
                [styles.bodyHighlight]: isEditing || isHighlighted,
              })}
            >
              <LiveReplyContainer
                story={story}
                comment={e.node}
                viewer={viewer}
                settings={settings}
                onInView={handleCommentInView}
                onEdit={handleOnEdit}
                editing={isEditing}
                onCancelEditing={handleOnCloseEdit}
                highlight={isEditing || isHighlighted}
              />
            </div>
          </div>
        );
      } else if (index < beforeComments.length + afterComments.length) {
        const e = afterComments[index - beforeComments.length];
        const isHighlighted = highlightedCommentID === e.node.id;
        const isEditing = editingCommentID === e.node.id;

        return (
          <div key={`chat-reply-${e.node.id}`} className={styles.comment}>
            <div
              className={cn(styles.body, {
                [styles.bodyHighlight]: isEditing || isHighlighted,
              })}
            >
              <LiveReplyContainer
                story={story}
                comment={e.node}
                viewer={viewer}
                settings={settings}
                onInView={handleCommentInView}
                onEdit={handleOnEdit}
                editing={isEditing}
                onCancelEditing={handleOnCloseEdit}
                highlight={isEditing || isHighlighted}
              />
            </div>
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
      editingCommentID,
      handleCommentInView,
      handleOnCloseEdit,
      handleOnEdit,
      highlightedCommentID,
      settings,
      story,
      viewer,
    ]
  );

  // We define a period at the beginning as cold start, where
  // different state might not yet be stable.
  const coldStart = useColdStart();

  return (
    <>
      <div className={styles.overlay}></div>
      <ClickOutside onClickOutside={close}>
        <div className={styles.root}>
          <Button className={styles.closeButton} onClick={close} color="none">
            <Icon className={styles.closeIcon}>cancel</Icon>
          </Button>

          <div className={styles.title}>
            <Flex justifyContent="flex-start" alignItems="center">
              <ShortcutIcon className={styles.replyingToIcon} />
              <div className={styles.replyingTo}>Replying to</div>
              <div className={styles.username}>
                {commentDeferred?.author?.username || ""}
              </div>
            </Flex>
          </div>

          {isLoading && <Spinner />}
          {error && (
            <CallOut
              color="error"
              title={error}
              titleWeight="semiBold"
              icon={<Icon>error</Icon>}
            />
          )}

          {!isLoading && commentDeferred && (
            <div>
              <div
                className={cn(styles.comment, {
                  [styles.header]:
                    beforeComments.length + afterComments.length > 0,
                })}
              >
                <LiveReplyContainer
                  story={story}
                  comment={commentDeferred}
                  viewer={viewer}
                  settings={settings}
                  onInView={handleCommentInView}
                  truncateBody
                />
              </div>
              <Virtuoso
                className={styles.replies}
                style={{ height }}
                firstItemIndex={START_INDEX - beforeComments.length}
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
                totalListHeightChanged={(h) => {
                  if (height >= 300) {
                    return;
                  }
                  setHeight(h);
                }}
              />
              {!newlyPostedReply && !tailing && afterHasMore && !coldStart && (
                <JumpToButton onClick={handleJumpToLive}>
                  Jump to live <Icon>arrow_downward</Icon>
                </JumpToButton>
              )}
              {newlyPostedReply && (
                <JumpToButton onClick={jumpToReply} onCancel={closeJumpToReply}>
                  Reply posted below <Icon>arrow_downward</Icon>
                </JumpToButton>
              )}
            </div>
          )}
          <div className={styles.commentForm}>
            {editingComment && editingComment.visible && (
              <LiveEditCommentFormContainer
                comment={editingComment.comment}
                ancestorID={comment.id}
                story={story}
                settings={settings}
                onClose={handleOnCloseEdit}
                onRefreshSettings={handleRefreshSettingsFromEdit}
                autofocus
              />
            )}
            {!editingComment && showReplyForm && comment.revision && (
              <LiveCreateCommentReplyFormContainer
                settings={settings}
                viewer={viewer}
                story={story}
                parentID={comment.id}
                parentRevisionID={comment.revision.id}
                onSubmitted={submit}
              />
            )}
          </div>
        </div>
      </ClickOutside>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveConversationContainer_story on Story {
      id
      ...LiveReplyContainer_story
      ...LiveCreateCommentReplyFormContainer_story
      ...LiveEditCommentFormContainer_story
      ...LiveCreateCommentReplyMutation_story
    }
  `,
  viewer: graphql`
    fragment LiveConversationContainer_viewer on User {
      id
      status {
        current
      }
      ...LiveReplyContainer_viewer
      ...LiveCreateCommentReplyFormContainer_viewer
      ...LiveCreateCommentReplyMutation_viewer
    }
  `,
  settings: graphql`
    fragment LiveConversationContainer_settings on Settings {
      ...LiveReplyContainer_settings
      ...LiveCreateCommentReplyFormContainer_settings
      ...LiveEditCommentFormContainer_settings
    }
  `,
  comment: graphql`
    fragment LiveConversationContainer_comment on Comment {
      id
      revision {
        id
      }
    }
  `,
  commentDeferred: graphql`
    fragment LiveConversationContainer_commentDeferred on Comment {
      author {
        username
      }
      ...LiveReplyContainer_comment
    }
  `,
  beforeComments: graphql`
    fragment LiveConversationContainer_beforeComments on CommentEdge
      @relay(plural: true) {
      node {
        id
        ...LiveReplyContainer_comment
      }
    }
  `,
  afterComments: graphql`
    fragment LiveConversationContainer_afterComments on CommentEdge
      @relay(plural: true) {
      node {
        id
        ...LiveReplyContainer_comment
      }
    }
  `,
})(LiveConversationContainer);

export default enhanced;
