import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { Component, MouseEvent } from "react";
import { graphql } from "react-relay";

import { isBeforeDate } from "coral-common/utils";
import { getURLWithCommentID } from "coral-framework/helpers";
import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { GQLTAG, GQLUSER_STATUS } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import { CommentContainer_comment as CommentData } from "coral-stream/__generated__/CommentContainer_comment.graphql";
import { CommentContainer_settings as SettingsData } from "coral-stream/__generated__/CommentContainer_settings.graphql";
import { CommentContainer_story as StoryData } from "coral-stream/__generated__/CommentContainer_story.graphql";
import { CommentContainer_viewer as ViewerData } from "coral-stream/__generated__/CommentContainer_viewer.graphql";
import CLASSES from "coral-stream/classes";
import {
  SetCommentIDMutation,
  ShowAuthPopupMutation,
  withSetCommentIDMutation,
  withShowAuthPopupMutation,
} from "coral-stream/mutations";
import { Ability, can } from "coral-stream/permissions";
import { Button, Flex, HorizontalGutter, Tag } from "coral-ui/components";

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
import ReportButtonContainer from "./ReportButton";
import ShowConversationLink from "./ShowConversationLink";
import { UsernameWithPopoverContainer } from "./Username";
import UserTagsContainer from "./UserTagsContainer";

interface Props {
  viewer: ViewerData | null;
  comment: CommentData;
  story: StoryData;
  settings: SettingsData;
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
}

interface State {
  showReplyDialog: boolean;
  showEditDialog: boolean;
  editable: boolean;
}

export class CommentContainer extends Component<Props, State> {
  private uneditableTimer: any;

  public state = {
    showReplyDialog: false,
    showEditDialog: false,
    editable: this.isEditable(),
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
      isBeforeDate(this.props.comment.editing.editableUntil)
    );
  }

  private toggleReplyDialog = () => {
    if (this.props.viewer) {
      this.setState(state => ({
        showReplyDialog: !state.showReplyDialog,
      }));
    } else {
      this.props.showAuthPopup({ view: "SIGN_IN" });
    }
  };

  private openEditDialog = () => {
    if (this.props.viewer) {
      this.setState(state => ({
        showEditDialog: true,
      }));
    } else {
      this.props.showAuthPopup({ view: "SIGN_IN" });
    }
  };

  private closeEditDialog = () => {
    this.setState(state => ({
      showEditDialog: false,
    }));
  };

  private closeReplyDialog = () => {
    this.setState(state => ({
      showReplyDialog: false,
    }));
  };

  private updateWhenNotEditable() {
    const ms =
      new Date(this.props.comment.editing.editableUntil).getTime() - Date.now();
    if (ms > 0) {
      return setTimeout(() => this.setState({ editable: false }), ms);
    }
    return;
  }

  private handleShowConversation = (e: MouseEvent) => {
    e.preventDefault();
    this.props.setCommentID({ id: this.props.comment.id });
    return false;
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
    } = this.props;
    const { showReplyDialog, showEditDialog, editable } = this.state;
    const hasFeaturedTag = Boolean(
      comment.tags.find(t => t.code === GQLTAG.FEATURED)
    );
    const commentTags = (
      <>
        {hasFeaturedTag && (
          <Tag
            className={CLASSES.comment.topBar.commentTag}
            color="primary"
            variant="pill"
          >
            <Localized id="comments-featuredTag">
              <span>Featured</span>
            </Localized>
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
      this.props.viewer && can(this.props.viewer, Ability.MODERATE);
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
        className={cn(CLASSES.comment.$root, className)}
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
                      viewer={viewer}
                      user={comment.author}
                    />
                    <UserTagsContainer
                      className={CLASSES.comment.topBar.userTag}
                      comment={comment}
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
                    <Localized id="comments-commentContainer-editButton">
                      <Button
                        color="primary"
                        variant="underlined"
                        onClick={this.openEditDialog}
                        className={CLASSES.comment.topBar.editButton}
                      >
                        Edit
                      </Button>
                    </Localized>
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
                    <ButtonsBar>
                      <ReactionButtonContainer
                        comment={comment}
                        settings={settings}
                        viewer={viewer}
                        readOnly={banned || suspended}
                        className={CLASSES.comment.actionBar.reactButton}
                        reactedClassName={
                          CLASSES.comment.actionBar.reactedButton
                        }
                      />
                      {!disableReplies &&
                        !banned &&
                        !suspended &&
                        !scheduledForDeletion && (
                          <ReplyButton
                            id={`comments-commentContainer-replyButton-${
                              comment.id
                            }`}
                            onClick={this.toggleReplyDialog}
                            active={showReplyDialog}
                            disabled={
                              settings.disableCommenting.enabled ||
                              story.isClosed
                            }
                            className={CLASSES.comment.actionBar.replyButton}
                          />
                        )}
                      <PermalinkButtonContainer
                        story={story}
                        commentID={comment.id}
                        className={CLASSES.comment.actionBar.shareButton}
                      />
                    </ButtonsBar>
                    <ButtonsBar>
                      {!banned && !suspended && (
                        <ReportButtonContainer
                          comment={comment}
                          viewer={viewer}
                          className={CLASSES.comment.actionBar.reportButton}
                          reportedClassName={
                            CLASSES.comment.actionBar.reportedButton
                          }
                        />
                      )}
                    </ButtonsBar>
                  </Flex>
                  {showConversationLink && (
                    <ShowConversationLink
                      className={CLASSES.comment.readMoreOfConversation}
                      id={`comments-commentContainer-showConversation-${
                        comment.id
                      }`}
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
          {showReplyDialog && !comment.deleted && (
            <ReplyCommentFormContainer
              settings={settings}
              comment={comment}
              story={story}
              onClose={this.closeReplyDialog}
              localReply={localReply}
            />
          )}
        </HorizontalGutter>
      </div>
    );
  }
}

const enhanced = withSetCommentIDMutation(
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
          ...ReportButtonContainer_viewer
          ...CaretContainer_viewer
        }
      `,
      story: graphql`
        fragment CommentContainer_story on Story {
          url
          isClosed
          ...CaretContainer_story
          ...ReplyCommentFormContainer_story
          ...PermalinkButtonContainer_story
          ...EditCommentFormContainer_story
        }
      `,
      comment: graphql`
        fragment CommentContainer_comment on Comment {
          id
          author {
            ...UsernameWithPopoverContainer_user
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
          ...ReplyCommentFormContainer_comment
          ...EditCommentFormContainer_comment
          ...ReactionButtonContainer_comment
          ...ReportButtonContainer_comment
          ...CaretContainer_comment
          ...RejectedTombstoneContainer_comment
          ...AuthorBadgesContainer_comment
          ...UserTagsContainer_comment
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
        }
      `,
    })(CommentContainer)
  )
);

export type CommentContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
