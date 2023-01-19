import { Localized } from "@fluent/react/compat";
import cn from "classnames";
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
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { MutationProp, useLocal, useMutation } from "coral-framework/lib/relay";
import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { Ability, can } from "coral-framework/permissions";
import {
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
  GQLTAG,
  GQLUSER_STATUS,
} from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "coral-stream/common/AuthPopup";
import { SetTraversalFocus } from "coral-stream/common/KeyboardShortcuts/SetTraversalFocus";
import { MAX_REPLY_INDENT_DEPTH } from "coral-stream/constants";
import {
  ShowEditFormEvent,
  ShowReplyFormEvent,
  ViewConversationEvent,
} from "coral-stream/events";
import { SetCommentIDMutation } from "coral-stream/mutations";
import {
  Button,
  Flex,
  Hidden,
  HorizontalGutter,
  Icon,
  RelativeTime,
} from "coral-ui/components/v2";
import MatchMedia from "coral-ui/components/v2/MatchMedia";

import { CommentContainer_comment as CommentData } from "coral-stream/__generated__/CommentContainer_comment.graphql";
import { CommentContainer_settings as SettingsData } from "coral-stream/__generated__/CommentContainer_settings.graphql";
import { CommentContainer_story as StoryData } from "coral-stream/__generated__/CommentContainer_story.graphql";
import { CommentContainer_viewer as ViewerData } from "coral-stream/__generated__/CommentContainer_viewer.graphql";
import { CommentContainerLocal } from "coral-stream/__generated__/CommentContainerLocal.graphql";

import { useCommentSeenEnabled } from "../commentSeen";
import { isPublished } from "../helpers";
import AnsweredTag from "./AnsweredTag";
import { ArchivedReportFlowContainer } from "./ArchivedReportFlow";
import AuthorBadges from "./AuthorBadges";
import ButtonsBar from "./ButtonsBar";
import computeCommentElementID from "./computeCommentElementID";
import EditCommentFormContainer from "./EditCommentForm";
import FeaturedTag from "./FeaturedTag";
import { isReplyFlattened } from "./flattenReplies";
import IndentedComment from "./IndentedComment";
import MarkCommentsAsSeenMutation from "./MarkCommentsAsSeenMutation";
import MediaSectionContainer from "./MediaSection/MediaSectionContainer";
import CaretContainer, {
  ModerationRejectedTombstoneContainer,
} from "./ModerationDropdown";
import PermalinkButtonContainer from "./PermalinkButton";
import ReactionButtonContainer from "./ReactionButton";
import RemoveAnswered from "./RemoveAnswered";
import ReplyButton from "./ReplyButton";
import ReplyCommentFormContainer from "./ReplyCommentForm";
import ReportFlowContainer, { ReportButton } from "./ReportFlow";
import ShowConversationLink from "./ShowConversationLink";
import { UsernameContainer, UsernameWithPopoverContainer } from "./Username";
import UserTagsContainer, { commentHasTags } from "./UserTagsContainer";

import styles from "./CommentContainer.css";

interface Props {
  viewer: ViewerData | null;
  enableJumpToParent?: boolean;
  comment: CommentData;
  story: StoryData;
  settings: SettingsData;
  indentLevel?: number;
  showAuthPopup: MutationProp<typeof ShowAuthPopupMutation>;
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
  collapsed?: boolean;
  toggleCollapsed?: () => void;

  /**
   * Set true, if this is semantically an ancestor to another comment.
   * Will add appropiate aria label.
   */
  ariaIsAncestor?: boolean;

  /**
   * Set true, if this is semantically a highlighted comment.
   * Will add appropiate aria label.
   */
  ariaIsHighlighted?: boolean;

  showRemoveAnswered?: boolean;
}

export const CommentContainer: FunctionComponent<Props> = ({
  className,
  collapsed,
  comment,
  disableReplies,
  hideAnsweredTag,
  hideModerationCarat,
  highlight,
  ariaIsAncestor,
  ariaIsHighlighted,
  indentLevel,
  localReply,
  settings,
  showConversationLink,
  hideReportButton,
  story,
  toggleCollapsed,
  viewer,
  showAuthPopup,
  showRemoveAnswered,
  enableJumpToParent,
}) => {
  const [{ showCommentIDs }] = useLocal<CommentContainerLocal>(graphql`
    fragment CommentContainerLocal on Local {
      showCommentIDs
    }
  `);
  const commentSeenEnabled = useCommentSeenEnabled();
  const canCommitCommentSeen = !!(viewer && viewer.id) && commentSeenEnabled;
  const { eventEmitter } = useCoralContext();
  const setTraversalFocus = useMutation(SetTraversalFocus);
  const markCommentsAsSeen = useMutation(MarkCommentsAsSeenMutation);
  const handleFocus = useCallback(() => {
    if (canCommitCommentSeen && !comment.seen) {
      void markCommentsAsSeen({
        commentIDs: [comment.id],
        storyID: story.id,
        updateSeen: true,
      });
    }

    void setTraversalFocus({
      commentID: comment.id,
      commentSeenEnabled: canCommitCommentSeen,
    });
  }, [
    comment.id,
    comment.seen,
    canCommitCommentSeen,
    markCommentsAsSeen,
    setTraversalFocus,
    story.id,
  ]);
  const setCommentID = useMutation(SetCommentIDMutation);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showEditDialog, setShowEditDialog, toggleShowEditDialog] =
    useToggleState(false);
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
  }, [isLoggedIn, showReplyDialog, eventEmitter, comment.id, showAuthPopup]);

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

    if (story.isArchiving || story.isArchived) {
      return false;
    }

    // Can't edit a comment if the editable date is before the current date!
    if (
      !comment.editing.editableUntil ||
      !isBeforeDate(comment.editing.editableUntil)
    ) {
      return false;
    }

    // Don't allow editing of rating comments
    if (
      !comment.body &&
      comment.rating &&
      !comment.tags.find((t) => t.code === GQLTAG.REVIEW)
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
  const isRatingsAndReviews =
    story.settings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS;

  // Author is expert if comment is tagged Expert and the
  // story mode is Q&A.
  const authorIsExpert: boolean =
    isQA && comment.tags.some((t) => t.code === GQLTAG.EXPERT);

  // Only show a button to clear removed answers if this comment is by an
  // expert, reply to a top level comment (question) with an answer.
  const removeAnswered: boolean =
    !comment.deleted &&
    isQA &&
    authorIsExpert &&
    indentLevel === 1 &&
    !!showRemoveAnswered;

  const showAvatar = settings.featureFlags.includes(GQLFEATURE_FLAG.AVATARS);

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
    !hideModerationCarat &&
    !story.isArchiving &&
    !story.isArchived;

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
  const badges =
    !!comment &&
    !!comment.author &&
    !!comment.author.badges &&
    comment.author.badges.length > 0
      ? comment.author.badges
      : null;
  const badgesJoin = badges
    ?.map((b: string) => `coral-badge-${b.replace(" ", "-")}`)
    .join(" ");
  const badgesClassName = badgesJoin ? badgesJoin : "";

  // Comment is not published after viewer rejected it.
  if (comment.lastViewerAction === "REJECT" && comment.status === "REJECTED") {
    return (
      <ModerationRejectedTombstoneContainer
        comment={comment}
        settings={settings}
      />
    );
  }

  // Comment is not published after edit, so don't render it anymore.
  if (comment.lastViewerAction === "EDIT" && !isPublished(comment.status)) {
    return null;
  }

  const commentElementID = computeCommentElementID(comment.id);

  // Boolean that indicates whether or not we want to
  // apply the "comment not seen class" for styling purposes.
  const shouldApplyNotSeenClass =
    canCommitCommentSeen &&
    !comment.seen &&
    !highlight &&
    comment.lastViewerAction !== "CREATE" &&
    comment.lastViewerAction !== "EDIT";

  return (
    <div
      className={cn(
        styles.root,
        className,
        CLASSES.comment.$root,
        `${CLASSES.comment.reacted}-${comment.actionCounts.reaction.total}`,
        badgesClassName
      )}
      tabIndex={-1}
      id={commentElementID}
      role="article"
      aria-labelledby={`${commentElementID}-label`}
      data-testid={commentElementID}
      // Added for keyboard shortcut support.
      data-key-stop
      data-not-seen={canCommitCommentSeen && !comment.seen ? true : undefined}
      onFocus={handleFocus}
    >
      {/* TODO: (cvle) Refactor at some point */}
      <Hidden id={`${commentElementID}-label`}>
        {indentLevel && (
          <>
            <Localized
              id="comments-commentContainer-threadLevelLabel"
              vars={{ level: indentLevel }}
            >
              <span>Thread Level {indentLevel}:</span>
            </Localized>{" "}
          </>
        )}
        {ariaIsHighlighted && (
          <>
            <Localized id="comments-commentContainer-highlightedLabel">
              <span>Highlighted:</span>
            </Localized>{" "}
          </>
        )}
        {ariaIsAncestor && (
          <>
            <Localized id="comments-commentContainer-ancestorLabel">
              <span>Ancestor:</span>
            </Localized>{" "}
          </>
        )}
        {comment.parent && (
          <Localized
            id="comments-commentContainer-replyLabel"
            vars={{ username: comment.author?.username ?? "" }}
            elems={{ RelativeTime: <RelativeTime date={comment.createdAt} /> }}
          >
            <span>
              Reply from {comment.author?.username}{" "}
              <RelativeTime date={comment.createdAt} />
            </span>
          </Localized>
        )}
        {!comment.parent && isQA && (
          <Localized
            id="comments-commentContainer-questionLabel"
            vars={{ username: comment.author?.username ?? "" }}
            elems={{ RelativeTime: <RelativeTime date={comment.createdAt} /> }}
          >
            <span>
              Question from {comment.author?.username}{" "}
              <RelativeTime date={comment.createdAt} />
            </span>
          </Localized>
        )}
        {!comment.parent && !isQA && (
          <Localized
            id="comments-commentContainer-commentLabel"
            vars={{ username: comment.author?.username ?? "" }}
            elems={{ RelativeTime: <RelativeTime date={comment.createdAt} /> }}
          >
            <span>
              Comment from {comment.author?.username}{" "}
              <RelativeTime date={comment.createdAt} />
            </span>
          </Localized>
        )}
      </Hidden>
      <HorizontalGutter>
        <IndentedComment
          id={comment.id}
          showCommentID={!!showCommentIDs}
          enableJumpToParent={enableJumpToParent}
          classNameIndented={cn(styles.indentedCommentRoot, {
            [styles.indented]: indentLevel && indentLevel > 0,
            [styles.commentSeenEnabled]: canCommitCommentSeen,
            [styles.notSeen]: shouldApplyNotSeenClass,
            [styles.flattenedPadding]: isReplyFlattened(
              settings.flattenReplies,
              indentLevel
            ),
            [CLASSES.comment.notSeen]: shouldApplyNotSeenClass,
            [styles.traversalFocus]: comment.hasTraversalFocus,
            [CLASSES.comment.focus]: comment.hasTraversalFocus,
          })}
          indentLevel={indentLevel}
          collapsed={collapsed}
          body={comment.body}
          rating={isRatingsAndReviews ? comment.rating : null}
          createdAt={comment.createdAt}
          blur={!!comment.pending}
          showEditedMarker={comment.editing.edited}
          highlight={highlight}
          toggleCollapsed={toggleCollapsed}
          parent={comment.parent}
          staticUsername={
            comment.author && (
              <Flex direction="row" alignItems="center" wrap>
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
                {badges && (
                  <AuthorBadges
                    className={CLASSES.comment.topBar.userBadge}
                    badges={badges}
                  />
                )}
              </Flex>
            )
          }
          username={comment.author?.username}
          usernameEl={
            comment.author && (
              <UsernameWithPopoverContainer
                className={cn(
                  styles.usernameButton,
                  CLASSES.comment.topBar.username
                )}
                comment={comment}
                viewer={viewer}
                settings={settings}
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
            badges && (
              <AuthorBadges
                className={CLASSES.comment.topBar.userBadge}
                badges={badges}
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
                      {showAvatar && comment.author?.avatar && (
                        <div
                          className={cn(
                            styles.avatarContainer,
                            CLASSES.comment.avatar
                          )}
                        >
                          <Localized
                            id="comments-commentContainer-avatar"
                            attrs={{ alt: true }}
                            vars={{
                              username: comment.author.username,
                            }}
                          >
                            <img
                              src={comment.author.avatar}
                              className={styles.avatar}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              alt={`Avatar for ${comment.author.username}`}
                            />
                          </Localized>
                        </div>
                      )}
                      {showModerationCaret && (
                        <CaretContainer
                          comment={comment}
                          story={story}
                          viewer={viewer!}
                          settings={settings}
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
                      isViewerBanned ||
                      isViewerSuspended ||
                      isViewerWarned ||
                      story.isArchived ||
                      story.isArchiving
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
                        author={comment.author?.username}
                        onClick={toggleShowReplyDialog}
                        active={showReplyDialog}
                        disabled={
                          !comment.canReply ||
                          settings.disableCommenting.enabled ||
                          story.isClosed ||
                          story.isArchived ||
                          story.isArchiving
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
                    author={comment.author?.username}
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
        {showReportFlow && !story.isArchived && !story.isArchiving && (
          <ReportFlowContainer
            viewer={viewer}
            comment={comment}
            settings={settings}
            onClose={toggleShowReportFlow}
          />
        )}
        {showReportFlow && (story.isArchived || story.isArchiving) && (
          <ArchivedReportFlowContainer settings={settings} comment={comment} />
        )}
        {showReplyDialog && !comment.deleted && (
          <ReplyCommentFormContainer
            settings={settings}
            comment={comment}
            story={story}
            onClose={toggleShowReplyDialog}
            localReply={localReply}
            showJumpToComment={Boolean(
              indentLevel &&
                indentLevel >= MAX_REPLY_INDENT_DEPTH - 1 &&
                settings.flattenReplies
            )}
          />
        )}
        {removeAnswered && (
          <RemoveAnswered commentID={comment.id} storyID={story.id} />
        )}
      </HorizontalGutter>
    </div>
  );
};

const enhanced = withShowAuthPopupMutation(
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
        id
        url
        isClosed
        canModerate
        settings {
          mode
        }
        isArchiving
        isArchived
        ...CaretContainer_story
        ...EditCommentFormContainer_story
        ...PermalinkButtonContainer_story
        ...ReplyCommentFormContainer_story
        ...UserTagsContainer_story
      }
    `,
    comment: graphql`
      fragment CommentContainer_comment on Comment {
        id
        author {
          id
          username
          avatar
          badges
        }
        parent {
          id
          author {
            username
          }
        }
        body
        createdAt
        status
        rating
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
        hasTraversalFocus
        seen
        canReply
        ...CaretContainer_comment
        ...EditCommentFormContainer_comment
        ...MediaSectionContainer_comment
        ...ReactionButtonContainer_comment
        ...ModerationRejectedTombstoneContainer_comment
        ...ReplyCommentFormContainer_comment
        ...ReportButton_comment
        ...ReportFlowContainer_comment
        ...UsernameContainer_comment
        ...UsernameWithPopoverContainer_comment
        ...UserTagsContainer_comment
        ...ArchivedReportFlowContainer_comment
      }
    `,
    settings: graphql`
      fragment CommentContainer_settings on Settings {
        flattenReplies
        disableCommenting {
          enabled
        }
        featureFlags
        ...CaretContainer_settings
        ...EditCommentFormContainer_settings
        ...MediaSectionContainer_settings
        ...ReactionButtonContainer_settings
        ...ModerationRejectedTombstoneContainer_settings
        ...ReplyCommentFormContainer_settings
        ...ReportFlowContainer_settings
        ...UsernameWithPopoverContainer_settings
        ...UserTagsContainer_settings
        ...ArchivedReportFlowContainer_settings
      }
    `,
  })(CommentContainer)
);

export type CommentContainerProps = PropTypesOf<typeof enhanced>;

export default enhanced;
