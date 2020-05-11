import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { EventEmitter2 } from "eventemitter2";
import React, { Component, MouseEvent } from "react";
import { graphql } from "react-relay";

import { isBeforeDate } from "coral-common/utils";
import { getURLWithCommentID } from "coral-framework/helpers";
import { withContext } from "coral-framework/lib/bootstrap";
import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { GQLSTORY_MODE, GQLTAG, GQLUSER_STATUS } from "coral-framework/schema";
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
import {
  Button,
  Flex,
  HorizontalGutter,
  Icon,
  Tag,
} from "coral-ui/components/v2";

import { CommentContainer_comment as CommentData } from "coral-stream/__generated__/CommentContainer_comment.graphql";
import { CommentContainer_settings as SettingsData } from "coral-stream/__generated__/CommentContainer_settings.graphql";
import { CommentContainer_story as StoryData } from "coral-stream/__generated__/CommentContainer_story.graphql";
import { CommentContainer_viewer as ViewerData } from "coral-stream/__generated__/CommentContainer_viewer.graphql";

import { isPublished } from "../helpers";
import UserBadgesContainer from "./AuthorBadgesContainer";
import ButtonsBar from "./ButtonsBar";
import EditCommentFormContainer from "./EditCommentForm";
import IndentedComment from "./IndentedComment";
import CaretContainer, {
  RejectedTombstoneContainer,
} from "./ModerationDropdown";
import PermalinkButtonContainer from "./PermalinkButton";
import ReactionButtonContainer from "./ReactionButton";
import ReplyButton from "./ReplyButton";
import ReplyCommentFormContainer from "./ReplyCommentForm";
import ReportFlowContainer, { ReportButton } from "./ReportFlow";
import ShowConversationLink from "./ShowConversationLink";
import { UsernameWithPopoverContainer } from "./Username";
import UserTagsContainer from "./UserTagsContainer";

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
}

interface State {
  showReplyDialog: boolean;
  showEditDialog: boolean;
  editable: boolean;
  showReportFlow: boolean;
}

export class CommentContainer extends Component<Props, State> {
  private uneditableTimer: any;

  public state = {
    showReplyDialog: false,
    showEditDialog: false,
    editable: this.isEditable(),
    showReportFlow: false,
  };

  constructor(props: Props) {
    super(props);
    if (this.isEditable()) {
      this.uneditableTimer = this.updateWhenNotEditable();
    }
  }

  public componentWillUnmount() {
    clearTimeout(this.uneditableTimer);
  }

  private isEditable() {
    const isMyComment = !!(
      this.props.viewer &&
      this.props.comment.author &&
      this.props.viewer.id === this.props.comment.author.id
    );
    const banned = Boolean(
      this.props.viewer &&
        this.props.viewer.status.current.includes(GQLUSER_STATUS.BANNED)
    );
    const suspended = Boolean(
      this.props.viewer &&
        this.props.viewer.status.current.includes(GQLUSER_STATUS.SUSPENDED)
    );
    return (
      !banned &&
      !suspended &&
      isMyComment &&
      !!this.props.comment.editing.editableUntil &&
      isBeforeDate(this.props.comment.editing.editableUntil)
    );
  }

  private toggleReplyDialog = () => {
    if (this.props.viewer) {
      this.setState((state) => {
        if (!state.showReplyDialog) {
          ShowReplyFormEvent.emit(this.props.eventEmitter, {
            commentID: this.props.comment.id,
          });
        }
        return {
          showReplyDialog: !state.showReplyDialog,
        };
      });
    } else {
      this.props.showAuthPopup({ view: "SIGN_IN" });
    }
  };

  private openEditDialog = () => {
    if (this.props.viewer) {
      ShowEditFormEvent.emit(this.props.eventEmitter, {
        commentID: this.props.comment.id,
      });
      this.setState((state) => ({
        showEditDialog: true,
      }));
    } else {
      this.props.showAuthPopup({ view: "SIGN_IN" });
    }
  };

  private closeEditDialog = () => {
    this.setState((state) => ({
      showEditDialog: false,
    }));
  };

  private closeReplyDialog = () => {
    this.setState((state) => ({
      showReplyDialog: false,
    }));
  };

  private updateWhenNotEditable() {
    const ms =
      new Date(this.props.comment.editing.editableUntil!).getTime() -
      Date.now();
    if (ms > 0) {
      return setTimeout(() => this.setState({ editable: false }), ms);
    }
    return;
  }

  private handleShowConversation = (e: MouseEvent) => {
    ViewConversationEvent.emit(this.props.eventEmitter, {
      commentID: this.props.comment.id,
      from: "COMMENT_STREAM",
    });
    e.preventDefault();
    this.props.setCommentID({ id: this.props.comment.id });
    return false;
  };

  private onReportButtonClicked = () => {
    this.setState({
      showReportFlow: !this.state.showReportFlow,
    });
  };
  private onCloseReportFlow = () => {
    this.setState({
      showReportFlow: false,
    });
  };

  public render() {
    const {
      comment,
      settings,
      story,
      indentLevel,
      localReply,
      disableReplies,
      showConversationLink,
      highlight,
      viewer,
      className,
      hideAnsweredTag,
    } = this.props;
    const { showReplyDialog, showEditDialog, editable } = this.state;
    const hasFeaturedTag = Boolean(
      comment.tags.find((t) => t.code === GQLTAG.FEATURED)
    );
    // We are in a Q&A if the story mode is set to QA.
    const isQA = Boolean(story.settings.mode === GQLSTORY_MODE.QA);
    // Author is expert if comment is tagged Expert and the
    // story mode is Q&A.
    const authorIsExpert =
      isQA && comment.tags.find((t) => t.code === GQLTAG.EXPERT);
    // Only show a button to clear removed answers if
    // this comment is by an expert, reply to a top level
    // comment (question) with an answer
    const showRemoveAnswered = Boolean(
      !comment.deleted &&
        isQA &&
        authorIsExpert &&
        indentLevel === 1 &&
        this.props.onRemoveAnswered
    );
    // When we're in Q&A and we are not un-answered (answered)
    // and we're a top level comment (no parent), then we
    // are an answered question
    const hasAnsweredTag = Boolean(
      !hideAnsweredTag &&
        isQA &&
        comment.tags.every((t) => t.code !== GQLTAG.UNANSWERED) &&
        !comment.parent
    );
    const commentTags = (
      <>
        {hasFeaturedTag && !isQA && (
          <Tag
            className={CLASSES.comment.topBar.featuredTag}
            color="streamBlue"
            variant="pill"
          >
            <Localized id="comments-featuredTag">
              <span>Featured</span>
            </Localized>
          </Tag>
        )}
        {hasAnsweredTag && isQA && (
          <Tag variant="regular" color="primary" className={styles.answeredTag}>
            <Flex alignItems="center">
              <Icon size="xs" className={styles.tagIcon}>
                check
              </Icon>
              <Localized id="qa-answered-tag">answered</Localized>
            </Flex>
          </Tag>
        )}
      </>
    );
    const banned = Boolean(
      this.props.viewer &&
        this.props.viewer.status.current.includes(GQLUSER_STATUS.BANNED)
    );
    const suspended = Boolean(
      this.props.viewer &&
        this.props.viewer.status.current.includes(GQLUSER_STATUS.SUSPENDED)
    );
    const scheduledForDeletion = Boolean(
      this.props.viewer && this.props.viewer.scheduledDeletionDate
    );
    const showCaret =
      this.props.viewer &&
      can(this.props.viewer, Ability.MODERATE) &&
      !this.props.hideModerationCarat;

    if (showEditDialog) {
      return (
        <div data-testid={`comment-${comment.id}`}>
          <EditCommentFormContainer
            settings={settings}
            comment={comment}
            story={story}
            onClose={this.closeEditDialog}
          />
        </div>
      );
    }
    // Comment is not published after viewer rejected it.
    if (
      comment.lastViewerAction === "REJECT" &&
      comment.status === "REJECTED"
    ) {
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
              body={comment.body}
              createdAt={comment.createdAt}
              blur={comment.pending || false}
              showEditedMarker={comment.editing.edited}
              highlight={highlight}
              parentAuthorName={
                comment.parent &&
                comment.parent.author &&
                comment.parent.author.username
              }
              username={
                comment.author && (
                  <>
                    <UsernameWithPopoverContainer
                      className={CLASSES.comment.topBar.username}
                      comment={comment}
                      viewer={viewer}
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
                  </>
                )
              }
              topBarRight={
                <Flex alignItems="center" itemGutter>
                  {commentTags}
                  {editable && (
                    <Button
                      color="regular"
                      variant="text"
                      onClick={this.openEditDialog}
                      className={CLASSES.comment.topBar.editButton}
                      data-testid="comment-edit-button"
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        className={styles.editButton}
                      >
                        <Icon className={styles.editIcon}>edit</Icon>
                        <Localized id="comments-commentContainer-editButton">
                          Edit
                        </Localized>
                      </Flex>
                    </Button>
                  )}
                  {showCaret && (
                    <CaretContainer
                      comment={comment}
                      story={story}
                      viewer={viewer!}
                    />
                  )}
                </Flex>
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
                        readOnly={banned || suspended}
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
                        !banned &&
                        !suspended &&
                        !scheduledForDeletion && (
                          <ReplyButton
                            id={`comments-commentContainer-replyButton-${comment.id}`}
                            onClick={this.toggleReplyDialog}
                            active={showReplyDialog}
                            disabled={
                              settings.disableCommenting.enabled ||
                              story.isClosed
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
                      {!banned &&
                        !suspended &&
                        !this.props.hideReportButton && (
                          <ReportButton
                            onClick={this.onReportButtonClicked}
                            open={this.state.showReportFlow}
                            viewer={this.props.viewer}
                            comment={this.props.comment}
                          />
                        )}
                    </ButtonsBar>
                  </Flex>
                  {showConversationLink && (
                    <ShowConversationLink
                      className={CLASSES.comment.readMoreOfConversation}
                      id={`comments-commentContainer-showConversation-${comment.id}`}
                      onClick={this.handleShowConversation}
                      href={getURLWithCommentID(
                        this.props.story.url,
                        this.props.comment.id
                      )}
                    />
                  )}
                </>
              }
            />
          )}
          {this.state.showReportFlow && (
            <ReportFlowContainer
              viewer={viewer}
              comment={comment}
              onClose={this.onCloseReportFlow}
            />
          )}
          {showReplyDialog && !comment.deleted && (
            <ReplyCommentFormContainer
              settings={settings}
              comment={comment}
              story={story}
              onClose={this.closeReplyDialog}
              localReply={localReply}
            />
          )}
          {showRemoveAnswered && (
            <Localized id="qa-unansweredTab-doneAnswering">
              <Button
                variant="regular"
                color="regular"
                className={styles.removeAnswered}
                onClick={this.props.onRemoveAnswered}
              >
                Done
              </Button>
            </Localized>
          )}
        </HorizontalGutter>
      </div>
    );
  }
}

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
          }
        `,
        settings: graphql`
          fragment CommentContainer_settings on Settings {
            disableCommenting {
              enabled
            }
            ...ReactionButtonContainer_settings
            ...ReplyCommentFormContainer_settings
            ...EditCommentFormContainer_settings
            ...UserTagsContainer_settings
          }
        `,
      })(CommentContainer)
    )
  )
);

export type CommentContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
