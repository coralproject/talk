import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  useMutation,
  useSubscription,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import { ViewFullDiscussionEvent } from "coral-stream/events";
import { SetCommentIDMutation } from "coral-stream/mutations";
import ReplyListContainer from "coral-stream/tabs/Comments/ReplyList";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { PermalinkViewContainer_comment as CommentData } from "coral-stream/__generated__/PermalinkViewContainer_comment.graphql";
import { PermalinkViewContainer_settings as SettingsData } from "coral-stream/__generated__/PermalinkViewContainer_settings.graphql";
import { PermalinkViewContainer_story as StoryData } from "coral-stream/__generated__/PermalinkViewContainer_story.graphql";
import { PermalinkViewContainer_viewer as ViewerData } from "coral-stream/__generated__/PermalinkViewContainer_viewer.graphql";

import { isPublished } from "../helpers";
import CommentEnteredSubscription from "../Stream/AllCommentsTab/CommentEnteredSubscription";
import ConversationThreadContainer from "./ConversationThreadContainer";

import styles from "./PermalinkViewContainer.css";

interface Props {
  comment: CommentData | null;
  story: StoryData;
  settings: SettingsData;
  viewer: ViewerData | null;
}

const PermalinkViewContainer: FunctionComponent<Props> = (props) => {
  const { comment, story, viewer, settings } = props;
  const setCommentID = useMutation(SetCommentIDMutation);
  const { pym, eventEmitter } = useCoralContext();

  const subscribeToCommentEntered = useSubscription(CommentEnteredSubscription);

  useEffect(() => {
    if (!comment?.id) {
      return;
    }
    const disposable = subscribeToCommentEntered({
      storyID: story.id,
      ancestorID: comment.id,
      liveDirectRepliesInsertion: true,
      storyConnectionKey: "Stream_comments",
    });
    return () => {
      disposable.dispose();
    };
  }, [comment?.id, story.id, subscribeToCommentEntered]);

  useEffect(() => {
    if (!pym) {
      return;
    }
    setTimeout(() => pym.scrollParentToChildPos(0), 100);
  }, [pym]);

  const onShowAllComments = useCallback(
    (e: MouseEvent<any>) => {
      ViewFullDiscussionEvent.emit(eventEmitter, {
        commentID: comment && comment.id,
      });
      void setCommentID({ id: null });
      e.preventDefault();
    },
    [comment, eventEmitter, setCommentID]
  );

  const showAllCommentsHref = useMemo(() => {
    const url = pym?.parentUrl || window.location.href;
    return getURLWithCommentID(url, undefined);
  }, [pym]);

  const commentVisible = comment && isPublished(comment.status);

  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.permalinkView.$root, {
        [CLASSES.permalinkView.authenticated]: Boolean(viewer),
        [CLASSES.permalinkView.unauthenticated]: !viewer,
      })}
      size="double"
    >
      <UserBoxContainer viewer={viewer} settings={settings} />
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
        <CallOut>
          <Localized id="comments-permalinkView-commentRemovedOrDoesNotExist">
            This comment has been removed or does not exist.
          </Localized>
        </CallOut>
      )}
      {comment && commentVisible && (
        <HorizontalGutter>
          <ConversationThreadContainer
            viewer={viewer}
            comment={comment}
            story={story}
            settings={settings}
          />
          <div className={styles.replyList}>
            <ReplyListContainer
              viewer={viewer}
              comment={comment}
              story={story}
              settings={settings}
              liveDirectRepliesInsertion
              allowTombstoneReveal
            />
          </div>
        </HorizontalGutter>
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment PermalinkViewContainer_story on Story {
      id
      ...ConversationThreadContainer_story
      ...ReplyListContainer1_story
      ...CreateCommentMutation_story
      ...CreateCommentReplyMutation_story
    }
  `,
  comment: graphql`
    fragment PermalinkViewContainer_comment on Comment {
      id
      status
      ...ConversationThreadContainer_comment
      ...ReplyListContainer1_comment
    }
  `,
  viewer: graphql`
    fragment PermalinkViewContainer_viewer on User {
      ...ConversationThreadContainer_viewer
      ...ReplyListContainer1_viewer
      ...UserBoxContainer_viewer
      ...CreateCommentMutation_viewer
      ...CreateCommentReplyMutation_viewer
    }
  `,
  settings: graphql`
    fragment PermalinkViewContainer_settings on Settings {
      ...ConversationThreadContainer_settings
      ...ReplyListContainer1_settings
      ...UserBoxContainer_settings
    }
  `,
})(PermalinkViewContainer);

export default enhanced;
