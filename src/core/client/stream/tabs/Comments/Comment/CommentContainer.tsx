import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { EventEmitter2 } from "eventemitter2";
import { clearLongTimeout, LongTimeout, setLongTimeout } from "long-settimeout";
import React, {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import { isBeforeDate } from "coral-common/utils";
import { getURLWithCommentID } from "coral-framework/helpers";
import { useToggleState } from "coral-framework/hooks";
import { withContext } from "coral-framework/lib/bootstrap";
import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import {
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
  GQLTAG,
  GQLUSER_STATUS,
} from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import {
  ShowEditFormEvent,
  ShowReplyFormEvent,
  ViewConversationEvent,
} from "coral-stream/events";
import {
  SetCommentIDMutation,
  ShowAuthPopupMutation,
  withSetCommentIDMutation,
  withShowAuthPopupMutation,
} from "coral-stream/mutations";
import { Ability, can } from "coral-stream/permissions";
import { Button, Flex, HorizontalGutter, Icon } from "coral-ui/components/v2";
import MatchMedia from "coral-ui/components/v2/MatchMedia";

import { CommentContainer_comment as CommentData } from "coral-stream/__generated__/CommentContainer_comment.graphql";
import { CommentContainer_settings as SettingsData } from "coral-stream/__generated__/CommentContainer_settings.graphql";
import { CommentContainer_story as StoryData } from "coral-stream/__generated__/CommentContainer_story.graphql";
import { CommentContainer_viewer as ViewerData } from "coral-stream/__generated__/CommentContainer_viewer.graphql";

import { isPublished } from "../helpers";
import AnsweredTag from "./AnsweredTag";
import UserBadgesContainer, { authorHasBadges } from "./AuthorBadgesContainer";
import ButtonsBar from "./ButtonsBar";
import EditCommentFormContainer from "./EditCommentForm";
import FeaturedTag from "./FeaturedTag";
import IndentedComment from "./IndentedComment";
import MediaSectionContainer from "./MediaSection/MediaSectionContainer";
import CaretContainer, {
  RejectedTombstoneContainer,
} from "./ModerationDropdown";
import PermalinkButtonContainer from "./PermalinkButton";
import ReactionButtonContainer from "./ReactionButton";
import ReplyButton from "./ReplyButton";
import ReplyCommentFormContainer from "./ReplyCommentForm";
import ReportFlowContainer, { ReportButton } from "./ReportFlow";
import ShowConversationLink from "./ShowConversationLink";
import { UsernameContainer, UsernameWithPopoverContainer } from "./Username";
import UserTagsContainer, { commentHasTags } from "./UserTagsContainer";

import styles from "./CommentContainer.css";

interface Props {
  viewer: ViewerData | null;
  comment: CommentData;
  story: StoryData;
  settings: SettingsData;
  eventEmitter: EventEmitter2;
  indentLevel?: number;
  showAuthPopup: ShowAuthPopupMutation;
  setCommentID: SetCommentIDMutation;
  /**
   * localReply will integrate the mutation response into
   * localReplies
   */
  localReply?: boolean;
  /** disableReplies will remove the ReplyButton */
  disableReplies?: boolean;
  /** showConversationLink will render a link to the conversation */
  showConversationLink?: boolean;
  highlight?: boolean;
  className?: string;

  hideAnsweredTag?: boolean;
  hideReportButton?: boolean;
  hideModerationCarat?: boolean;
  onRemoveAnswered?: () => void;
  collapsed?: boolean;
  toggleCollapsed?: () => void;
}

export const CommentContainer: FunctionComponent<Props> = ({
  className,
  collapsed,
  comment,
  disableReplies,
  hideAnsweredTag,
  hideModerationCarat,
  highlight,
  indentLevel,
  localReply,
  onRemoveAnswered,
  settings,
  showConversationLink,
  hideReportButton,
  story,
  toggleCollapsed,
  eventEmitter,
  setCommentID,
  viewer,
  showAuthPopup,
}) => {
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [
    showEditDialog,
    setShowEditDialog,
    toggleShowEditDialog,
  ] = useToggleState(false);
  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);
  const handleShowConversation = useCallback(
    (e: MouseEvent) => {
      ViewConversationEvent.emit(eventEmitter, {
        commentID: comment.id,
        from: "COMMENT_STREAM",
      });

      // If the feature for read more new tab is enabled, then redirect the
      // user.

      // If the feature flag for opening this in a new tab is enabled, then we
      // don't need to do anything!
      if (settings.featureFlags.includes(GQLFEATURE_FLAG.READ_MORE_NEW_TAB)) {
        return;
      }

      // Prevent the event from acting.
      e.preventDefault();

      // Update the current view to show the comment.
      void setCommentID({ id: comment.id });

      return false;
    },
    [eventEmitter, comment.id, settings.featureFlags, setCommentID]
  );

  const isLoggedIn = !!viewer;

  const openEditDialog = useCallback(() => {
    if (isLoggedIn) {
      ShowEditFormEvent.emit(eventEmitter, {
        commentID: comment.id,
      });
      setShowEditDialog(true);
    } else {
      void showAuthPopup({ view: "SIGN_IN" });
    }
  }, [isLoggedIn, eventEmitter, comment.id, setShowEditDialog, showAuthPopup]);

  const toggleShowReplyDialog = useCallback(() => {
    if (isLoggedIn) {
      if (!showReplyDialog) {
        ShowReplyFormEvent.emit(eventEmitter, {
          commentID: comment.id,
        });
      }

      setShowReplyDialog((v) => !v);
    } else {
      void showAuthPopup({ view: "SIGN_IN" });
    }
  }, [
    isLoggedIn,
    showReplyDialog,
    setShowReplyDialog,
    showAuthPopup,
    eventEmitter,
    comment,
  ]);

  const isViewerBanned = !!viewer?.status.current.includes(
    GQLUSER_STATUS.BANNED
  );
  const isViewerSuspended = !!viewer?.status.current.includes(
    GQLUSER_STATUS.SUSPENDED
  );
  const isViewerWarned = !!viewer?.status.current.includes(
    GQLUSER_STATUS.WARNED
  );
  const isViewerScheduledForDeletion = !!viewer?.scheduledDeletionDate;

  const isViewerComment =
    // Can't edit a comment if you aren't logged in!
    !!viewer &&
    // Can't edit a comment if there isn't an author on it!
    !!comment.author &&
    // Can't edit a comment if the comment isn't the viewers!
    viewer.id === comment.author.id;

  // The editable initial value is the result of the the funtion here.
  const [editable, setEditable] = useState(() => {
    // Can't edit a comment that the viewer didn't write! If the user is banned
    // or suspended too they can't edit.
    if (
      !isViewerComment ||
      isViewerBanned ||
      isViewerSuspended ||
      isViewerWarned
    ) {
      return false;
    }

    // Can't edit a comment if the editable date is before the current date!
    if (
      !comment.editing.editableUntil ||
      !isBeforeDate(comment.editing.editableUntil)
    ) {
      return false;
    }

    // Comment is editable!
    return true;
  });

  useEffect(() => {
    // If the comment is not editable now, it can't be editable in the future,
    // so exit!
    if (!editable) {
      return;
    }

    // The comment is editable, we should register a callback to remove that
    // status when it is no longer editable. We know that the `editableUntil` is
    // available because it was editable!
    const editableFor =
      new Date(comment.editing.editableUntil!).getTime() - Date.now();
    if (editableFor <= 0) {
      // Can't schedule a timer for the past! The comment is no longer editable.
      setEditable(false);
      return;
    }

    // Setup the timeout.
    const timeout: LongTimeout | null = setLongTimeout(() => {
      // Mark the comment as not editable.
      setEditable(false);
    }, editableFor);

    return () => {
      // When this component is disposed, also clear the timeout.
      clearLongTimeout(timeout);
    };
  }, [comment.editing.editableUntil, editable]);

  const hasFeaturedTag = comment.tags.some((t) => t.code === GQLTAG.FEATURED);

  // We are in a Q&A if the story mode is set to QA.
  const isQA = story.settings.mode === GQLSTORY_MODE.QA;

  // Author is expert if comment is tagged Expert and the
  // story mode is Q&A.
  const authorIsExpert: boolean =
    isQA && comment.tags.some((t) => t.code === GQLTAG.EXPERT);

  // Only show a button to clear removed answers if this comment is by an
  // expert, reply to a top level comment (question) with an answer.
  const showRemoveAnswered: boolean =
    !comment.deleted &&
    isQA &&
    authorIsExpert &&
    indentLevel === 1 &&
    !!onRemoveAnswered;

  // When we're in Q&A and we are not un-answered (answered) and we're a top
  // level comment (no parent), then we are an answered question.
  const hasAnsweredTag: boolean =
    !hideAnsweredTag &&
    isQA &&
    comment.tags.every((t) => t.code !== GQLTAG.UNANSWERED) &&
    !comment.parent;

  const commentTags = (
    <>
      {hasFeaturedTag && !isQA && <FeaturedTag collapsed={collapsed} />}
      {hasAnsweredTag && isQA && <AnsweredTag collapsed={collapsed} />}
    </>
  );

  const showModerationCaret: boolean =
    !!viewer &&
    story.canModerate &&
    can(viewer, Ability.MODERATE) &&
    !hideModerationCarat;

  if (showEditDialog) {
    return (
      <div data-testid={`comment-${comment.id}`}>
        <EditCommentFormContainer
          settings={settings}
          comment={comment}
          story={story}
          onClose={toggleShowEditDialog}
        />
      </div>
    );
  }

  const hasTags = commentHasTags(story, comment);
  const hasBadges = authorHasBadges(comment);

  // Comment is not published after viewer rejected it.
  if (comment.lastViewerAction === "REJECT" && comment.status === "REJECTED") {
    return <RejectedTombstoneContainer comment={comment} />;
  }

  // Comment is not published after edit, so don't render it anymore.
  if (comment.lastViewerAction === "EDIT" && !isPublished(comment.status)) {
    return null;
  }

  return (
    <div
      className={cn(
        CLASSES.comment.$root,
        `${CLASSES.comment.reacted}-${comment.actionCounts.reaction.total}`,
        className
      )}
      data-testid={`comment-${comment.id}`}
    >
      <HorizontalGutter>
        {!comment.deleted && (
          <IndentedComment
            indentLevel={indentLevel}
            collapsed={collapsed}
            body={comment.body}
            createdAt={comment.createdAt}
            blur={!!comment.pending}
            showEditedMarker={comment.editing.edited}
            highlight={highlight}
            toggleCollapsed={toggleCollapsed}
            parentAuthorName={comment.parent?.author?.username}
            staticUsername={
              comment.author && (
                <Flex direction="row" alignItems="center">
                  <UsernameContainer
                    className={cn(
                      styles.staticUsername,
                      CLASSES.comment.topBar.username
                    )}
                    comment={comment}
                  />
                  <UserTagsContainer
                    className={CLASSES.comment.topBar.userTag}
                    story={story}
                    comment={comment}
                    settings={settings}
                  />
                  <UserBadgesContainer
                    className={CLASSES.comment.topBar.userBadge}
                    comment={comment}
                  />
                </Flex>
              )
            }
            username={
              comment.author && (
                <UsernameWithPopoverContainer
                  className={CLASSES.comment.topBar.username}
                  comment={comment}
                  viewer={viewer}
                />
              )
            }
            tags={
              comment.author &&
              hasTags && (
                <UserTagsContainer
                  className={CLASSES.comment.topBar.userTag}
                  story={story}
                  comment={comment}
                  settings={settings}
                />
              )
            }
            badges={
              comment.author &&
              hasBadges && (
                <UserBadgesContainer
                  className={CLASSES.comment.topBar.userBadge}
                  comment={comment}
                />
              )
            }
            staticTopBarRight={commentTags}
            topBarRight={
              <>
                <MatchMedia gteWidth="mobile">
                  {(matches) => (
                    <>
                      <Flex
                        alignItems="center"
                        justifyContent="flex-end"
                        itemGutter
                      >
                        {matches ? commentTags : null}
                        {editable && (
                          <Button
                            color="stream"
                            variant="text"
                            onClick={openEditDialog}
                            className={cn(
                              CLASSES.comment.topBar.editButton,
                              styles.editButton
                            )}
                            data-testid="comment-edit-button"
                          >
                            <Flex alignItems="center" justifyContent="center">
                              <Icon className={styles.editIcon}>edit</Icon>
                              <Localized id="comments-commentContainer-editButton">
                                Edit
                              </Localized>
                            </Flex>
                          </Button>
                        )}
                        {showModerationCaret && (
                          <CaretContainer
                            comment={comment}
                            story={story}
                            viewer={viewer!}
                          />
                        )}
                      </Flex>
                      {!matches ? commentTags : null}
                    </>
                  )}
                </MatchMedia>
              </>
            }
            media={
              <MediaSectionContainer
                comment={comment}
                settings={settings}
                defaultExpanded={viewer?.mediaSettings?.unfurlEmbeds}
              />
            }
            footer={
              <>
                <Flex
                  justifyContent="space-between"
                  className={CLASSES.comment.actionBar.$root}
                >
                  <ButtonsBar className={styles.actionBar}>
                    <ReactionButtonContainer
                      comment={comment}
                      settings={settings}
                      viewer={viewer}
                      readOnly={
                        isViewerBanned || isViewerSuspended || isViewerWarned
                      }
                      className={cn(
                        styles.actionButton,
                        CLASSES.comment.actionBar.reactButton
                      )}
                      reactedClassName={cn(
                        styles.actionButton,
                        CLASSES.comment.actionBar.reactedButton
                      )}
                      isQA={story.settings.mode === GQLSTORY_MODE.QA}
                    />
                    {!disableReplies &&
                      !isViewerBanned &&
                      !isViewerSuspended &&
                      !isViewerWarned &&
                      !isViewerScheduledForDeletion && (
                        <ReplyButton
                          id={`comments-commentContainer-replyButton-${comment.id}`}
                          onClick={toggleShowReplyDialog}
                          active={showReplyDialog}
                          disabled={
                            settings.disableCommenting.enabled || story.isClosed
                          }
                          className={cn(
                            styles.actionButton,
                            CLASSES.comment.actionBar.replyButton
                          )}
                        />
                      )}
                    <PermalinkButtonContainer
                      story={story}
                      commentID={comment.id}
                      className={cn(
                        styles.actionButton,
                        CLASSES.comment.actionBar.shareButton
                      )}
                    />
                  </ButtonsBar>
                  <ButtonsBar>
                    {!isViewerBanned &&
                      !isViewerSuspended &&
                      !isViewerWarned &&
                      !hideReportButton && (
                        <ReportButton
                          onClick={toggleShowReportFlow}
                          open={showReportFlow}
                          viewer={viewer}
                          comment={comment}
                        />
                      )}
                  </ButtonsBar>
                </Flex>
                {showConversationLink && (
                  <ShowConversationLink
                    className={CLASSES.comment.readMoreOfConversation}
                    id={`comments-commentContainer-showConversation-${comment.id}`}
                    onClick={handleShowConversation}
                    href={getURLWithCommentID(story.url, comment.id)}
                  />
                )}
              </>
            }
          />
        )}
        {showReportFlow && (
          <ReportFlowContainer
            viewer={viewer}
            comment={comment}
            onClose={toggleShowReportFlow}
          />
        )}
        {showReplyDialog && !comment.deleted && (
          <ReplyCommentFormContainer
            settings={settings}
            comment={comment}
            story={story}
            onClose={toggleShowReplyDialog}
            localReply={localReply}
          />
        )}
        {showRemoveAnswered && (
          <Localized id="qa-unansweredTab-doneAnswering">
            <Button
              variant="regular"
              color="regular"
              className={styles.removeAnswered}
              onClick={onRemoveAnswered}
            >
              Done
            </Button>
          </Localized>
        )}
      </HorizontalGutter>
    </div>
  );
};

const enhanced = withContext(({ eventEmitter }) => ({ eventEmitter }))(
  withSetCommentIDMutation(
    withShowAuthPopupMutation(
      withFragmentContainer<Props>({
        viewer: graphql`
          fragment CommentContainer_viewer on User {
            id
            status {
              current
            }
            ignoredUsers {
              id
            }
            badges
            role
            scheduledDeletionDate
            mediaSettings {
              unfurlEmbeds
            }
            ...UsernameWithPopoverContainer_viewer
            ...ReactionButtonContainer_viewer
            ...ReportFlowContainer_viewer
            ...ReportButton_viewer
            ...CaretContainer_viewer
          }
        `,
        story: graphql`
          fragment CommentContainer_story on Story {
            url
            isClosed
            canModerate
            settings {
              mode
            }
            ...CaretContainer_story
            ...ReplyCommentFormContainer_story
            ...PermalinkButtonContainer_story
            ...EditCommentFormContainer_story
            ...UserTagsContainer_story
          }
        `,
        comment: graphql`
          fragment CommentContainer_comment on Comment {
            id
            author {
              id
              username
            }
            parent {
              author {
                username
              }
            }
            body
            createdAt
            status
            editing {
              edited
              editableUntil
            }
            tags {
              code
            }
            pending
            lastViewerAction
            deleted
            actionCounts {
              reaction {
                total
              }
            }
            viewerActionPresence {
              dontAgree
              flag
            }
            ...ReplyCommentFormContainer_comment
            ...EditCommentFormContainer_comment
            ...ReactionButtonContainer_comment
            ...ReportFlowContainer_comment
            ...ReportButton_comment
            ...CaretContainer_comment
            ...RejectedTombstoneContainer_comment
            ...AuthorBadgesContainer_comment
            ...UserTagsContainer_comment
            ...UsernameWithPopoverContainer_comment
            ...UsernameContainer_comment
            ...MediaSectionContainer_comment
            ...UsernameContainer_comment
          }
        `,
        settings: graphql`
          fragment CommentContainer_settings on Settings {
            disableCommenting {
              enabled
            }
            featureFlags
            ...ReactionButtonContainer_settings
            ...ReplyCommentFormContainer_settings
            ...EditCommentFormContainer_settings
            ...UserTagsContainer_settings
            ...MediaSectionContainer_settings
          }
        `,
      })(CommentContainer)
    )
  )
);

export type CommentContainerProps = PropTypesOf<typeof enhanced>;

export default enhanced;
