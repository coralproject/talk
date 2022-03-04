import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { graphql, useFragment } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation, useSubscription } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import { ViewFullDiscussionEvent } from "coral-stream/events";
import { SetCommentIDMutation } from "coral-stream/mutations";
import ReplyListContainer from "coral-stream/tabs/Comments/ReplyList";
import { CommentEnteredSubscription } from "coral-stream/tabs/Comments/Stream/Subscriptions";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { PermalinkViewContainer_comment$key as CommentData } from "coral-stream/__generated__/PermalinkViewContainer_comment.graphql";
import { PermalinkViewContainer_settings$key as SettingsData } from "coral-stream/__generated__/PermalinkViewContainer_settings.graphql";
import { PermalinkViewContainer_story$key as StoryData } from "coral-stream/__generated__/PermalinkViewContainer_story.graphql";
import { PermalinkViewContainer_viewer$key as ViewerData } from "coral-stream/__generated__/PermalinkViewContainer_viewer.graphql";

import { isPublished } from "../helpers";
import ConversationThreadContainer from "./ConversationThreadContainer";

import styles from "./PermalinkViewContainer.css";

interface Props {
  comment: CommentData | null;
  story: StoryData;
  settings: SettingsData;
  viewer: ViewerData | null;
}

const PermalinkViewContainer: FunctionComponent<Props> = ({
  comment,
  story,
  settings,
  viewer,
}) => {
  const storyData = useFragment(
    graphql`
      fragment PermalinkViewContainer_story on Story {
        id
        ...ConversationThreadContainer_story
        ...ReplyListContainer1_story
        ...CreateCommentMutation_story
        ...CreateCommentReplyMutation_story
      }
    `,
    story
  );
  const commentData = useFragment(
    graphql`
      fragment PermalinkViewContainer_comment on Comment {
        id
        status
        ...ConversationThreadContainer_comment
        ...ReplyListContainer1_comment
      }
    `,
    comment
  );
  const viewerData = useFragment(
    graphql`
      fragment PermalinkViewContainer_viewer on User {
        id
        ...ConversationThreadContainer_viewer
        ...ReplyListContainer1_viewer
        ...UserBoxContainer_viewer
        ...CreateCommentMutation_viewer
        ...CreateCommentReplyMutation_viewer
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment PermalinkViewContainer_settings on Settings {
        ...ConversationThreadContainer_settings
        ...ReplyListContainer1_settings
        ...UserBoxContainer_settings
      }
    `,
    settings
  );

  const setCommentID = useMutation(SetCommentIDMutation);
  const { pym, eventEmitter, window } = useCoralContext();

  const subscribeToCommentEntered = useSubscription(CommentEnteredSubscription);

  useEffect(() => {
    if (!commentData?.id) {
      return;
    }
    const disposable = subscribeToCommentEntered({
      storyID: storyData.id,
      ancestorID: commentData.id,
      liveDirectRepliesInsertion: true,
      storyConnectionKey: "Stream_comments",
    });
    return () => {
      disposable.dispose();
    };
  }, [commentData?.id, storyData.id, subscribeToCommentEntered]);

  useEffect(() => {
    if (!pym) {
      return;
    }
    setTimeout(() => pym.scrollParentToChildPos(0), 100);
  }, [pym]);

  const onShowAllComments = useCallback(
    (e: MouseEvent<any>) => {
      ViewFullDiscussionEvent.emit(eventEmitter, {
        commentID: commentData && commentData.id,
      });
      void setCommentID({ id: null });
      e.preventDefault();
    },
    [commentData, eventEmitter, setCommentID]
  );

  const showAllCommentsHref = useMemo(() => {
    const url = pym?.parentUrl || window.location.href;
    return getURLWithCommentID(url, undefined);
  }, [pym?.parentUrl, window.location.href]);

  const commentVisible = commentData && isPublished(commentData.status);

  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.permalinkView.$root, {
        [CLASSES.permalinkView.authenticated]: Boolean(viewerData),
        [CLASSES.permalinkView.unauthenticated]: !viewerData,
      })}
      size="double"
    >
      <UserBoxContainer viewer={viewerData} settings={settingsData} />
      <Localized
        id="comments-permalinkView-section"
        attrs={{ "aria-label": true }}
      >
        <HorizontalGutter
          size="double"
          container="section"
          aria-label="Single Conversation"
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            direction="column"
            className={styles.header}
          >
            <Localized id="comments-permalinkView-youAreCurrentlyViewing">
              <div className={styles.title}>
                You are currently viewing a single conversation
              </div>
            </Localized>
            {showAllCommentsHref && (
              <Localized id="comments-permalinkView-viewFullDiscussion">
                <Button
                  className={CLASSES.permalinkView.viewFullDiscussionButton}
                  variant="flat"
                  color="primary"
                  fontSize="medium"
                  fontWeight="semiBold"
                  onClick={onShowAllComments}
                  href={showAllCommentsHref}
                  target="_parent"
                  anchor
                  underline
                >
                  View full discussion
                </Button>
              </Localized>
            )}
          </Flex>
          {!commentVisible && (
            <CallOut aria-live="polite">
              <Localized id="comments-permalinkView-commentRemovedOrDoesNotExist">
                This comment has been removed or does not exist.
              </Localized>
            </CallOut>
          )}
          {comment && commentVisible && (
            <HorizontalGutter>
              <ConversationThreadContainer
                viewer={viewerData}
                comment={commentData}
                story={storyData}
                settings={settingsData}
              />
              <div className={styles.replyList}>
                <ReplyListContainer
                  viewer={viewerData}
                  comment={commentData}
                  story={storyData}
                  settings={settingsData}
                  liveDirectRepliesInsertion
                  allowIgnoredTombstoneReveal
                  disableHideIgnoredTombstone
                />
              </div>
            </HorizontalGutter>
          )}
        </HorizontalGutter>
      </Localized>
    </HorizontalGutter>
  );
};

export default PermalinkViewContainer;
