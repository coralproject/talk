import { Localized } from "fluent-react/compat";
import React, { Component, MouseEvent } from "react";
import { graphql } from "react-relay";

import { isBeforeDate } from "talk-common/utils";
import { getURLWithCommentID } from "talk-framework/helpers";
import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { PropTypesOf } from "talk-framework/types";
import { CommentContainer_asset as AssetData } from "talk-stream/__generated__/CommentContainer_asset.graphql";
import { CommentContainer_comment as CommentData } from "talk-stream/__generated__/CommentContainer_comment.graphql";
import { CommentContainer_me as MeData } from "talk-stream/__generated__/CommentContainer_me.graphql";
import { CommentContainer_settings as SettingsData } from "talk-stream/__generated__/CommentContainer_settings.graphql";
import {
  SetCommentIDMutation,
  ShowAuthPopupMutation,
  withSetCommentIDMutation,
  withShowAuthPopupMutation,
} from "talk-stream/mutations";

import { Button, HorizontalGutter } from "talk-ui/components";
import ReactionButtonContainer from "./ReactionButtonContainer";

import Comment, {
  ButtonsBar,
  ShowConversationLink,
} from "../components/Comment";
import ReplyButton from "../components/Comment/ReplyButton";
import EditCommentFormContainer from "./EditCommentFormContainer";
import PermalinkButtonContainer from "./PermalinkButtonContainer";
import ReplyCommentFormContainer from "./ReplyCommentFormContainer";

interface InnerProps {
  me: MeData | null;
  comment: CommentData;
  asset: AssetData;
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
}

interface State {
  showReplyDialog: boolean;
  showEditDialog: boolean;
  editable: boolean;
}

export class CommentContainer extends Component<InnerProps, State> {
  private uneditableTimer: any;

  public state = {
    showReplyDialog: false,
    showEditDialog: false,
    editable: this.isEditable(),
  };

  constructor(props: InnerProps) {
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
      this.props.me &&
      this.props.comment.author &&
      this.props.me.id === this.props.comment.author.id
    );
    return (
      isMyComment && isBeforeDate(this.props.comment.editing.editableUntil)
    );
  }

  private openReplyDialog = () => {
    if (this.props.me) {
      this.setState(state => ({
        showReplyDialog: true,
      }));
    } else {
      this.props.showAuthPopup({ view: "SIGN_IN" });
    }
  };

  private openEditDialog = () => {
    if (this.props.me) {
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
      asset,
      indentLevel,
      localReply,
      disableReplies,
      showConversationLink,
      highlight,
      me,
    } = this.props;
    const { showReplyDialog, showEditDialog, editable } = this.state;
    if (showEditDialog) {
      return (
        <EditCommentFormContainer
          comment={comment}
          onClose={this.closeEditDialog}
        />
      );
    }
    return (
      <HorizontalGutter>
        <Comment
          id={`comment-${comment.id}`}
          indentLevel={indentLevel}
          username={comment.author && comment.author.username}
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
          topBarRight={
            (editable && (
              <Localized id="comments-commentContainer-editButton">
                <Button
                  id={`comments-commentContainer-editButton-${comment.id}`}
                  color="primary"
                  variant="underlined"
                  onClick={this.openEditDialog}
                >
                  Edit
                </Button>
              </Localized>
            )) ||
            undefined
          }
          footer={
            <>
              <ButtonsBar>
                {!disableReplies && (
                  <ReplyButton
                    id={`comments-commentContainer-replyButton-${comment.id}`}
                    onClick={this.openReplyDialog}
                    active={showReplyDialog}
                  />
                )}
                <PermalinkButtonContainer
                  asset={asset}
                  commentID={comment.id}
                />
                <ReactionButtonContainer
                  comment={comment}
                  settings={settings}
                  me={me}
                />
              </ButtonsBar>
              {showConversationLink && (
                <ShowConversationLink
                  id={`comments-commentContainer-showConversation-${
                    comment.id
                  }`}
                  onClick={this.handleShowConversation}
                  href={getURLWithCommentID(
                    this.props.asset.url,
                    this.props.comment.id
                  )}
                />
              )}
            </>
          }
        />
        {showReplyDialog && (
          <ReplyCommentFormContainer
            comment={comment}
            asset={asset}
            onClose={this.closeReplyDialog}
            localReply={localReply}
          />
        )}
      </HorizontalGutter>
    );
  }
}

const enhanced = withSetCommentIDMutation(
  withShowAuthPopupMutation(
    withFragmentContainer<InnerProps>({
      me: graphql`
        fragment CommentContainer_me on User {
          id
          ...ReactionButtonContainer_me
        }
      `,
      asset: graphql`
        fragment CommentContainer_asset on Asset {
          url
          ...ReplyCommentFormContainer_asset
          ...PermalinkButtonContainer_asset
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
          editing {
            edited
            editableUntil
          }
          pending
          ...ReplyCommentFormContainer_comment
          ...EditCommentFormContainer_comment
          ...ReactionButtonContainer_comment
        }
      `,
      settings: graphql`
        fragment CommentContainer_settings on Settings {
          ...ReactionButtonContainer_settings
        }
      `,
    })(CommentContainer)
  )
);

export type CommentContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
