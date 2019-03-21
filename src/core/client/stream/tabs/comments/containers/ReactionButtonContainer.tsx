import React from "react";
import { graphql } from "react-relay";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { ReactionButtonContainer_comment as CommentData } from "talk-stream/__generated__/ReactionButtonContainer_comment.graphql";
import { ReactionButtonContainer_settings as SettingsData } from "talk-stream/__generated__/ReactionButtonContainer_settings.graphql";
import { ReactionButtonContainer_viewer as ViewerData } from "talk-stream/__generated__/ReactionButtonContainer_viewer.graphql";

import {
  CreateCommentReactionMutation,
  RemoveCommentReactionMutation,
  withCreateCommentReactionMutation,
  withRemoveCommentReactionMutation,
} from "talk-stream/mutations";
import ReactionButton from "talk-stream/tabs/comments/components/ReactionButton";

import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "talk-stream/mutations";

interface ReactionButtonContainerProps {
  createCommentReaction: CreateCommentReactionMutation;
  removeCommentReaction: RemoveCommentReactionMutation;
  comment: CommentData;
  settings: SettingsData;
  viewer: ViewerData | null;
  showAuthPopup: ShowAuthPopupMutation;
}

class ReactionButtonContainer extends React.Component<
  ReactionButtonContainerProps
> {
  private handleSignIn = () => this.props.showAuthPopup({ view: "SIGN_IN" });

  private handleClick = () => {
    if (this.props.viewer === null) {
      return this.handleSignIn();
    }

    const input = {
      commentID: this.props.comment.id,
      commentRevisionID: this.props.comment.revision.id,
    };

    const { createCommentReaction, removeCommentReaction } = this.props;
    const reacted =
      this.props.comment.viewerActionPresence &&
      this.props.comment.viewerActionPresence.reaction;

    return reacted
      ? removeCommentReaction(input)
      : createCommentReaction(input);
  };

  public render() {
    const {
      actionCounts: {
        reaction: { total: totalReactions },
      },
    } = this.props.comment;
    const {
      reaction: { label, labelActive, icon, iconActive },
    } = this.props.settings;

    const reacted =
      this.props.comment.viewerActionPresence &&
      this.props.comment.viewerActionPresence.reaction;

    return (
      <ReactionButton
        onClick={this.handleClick}
        totalReactions={totalReactions}
        reacted={reacted}
        label={label}
        labelActive={labelActive}
        icon={icon}
        iconActive={iconActive}
      />
    );
  }
}

export default withShowAuthPopupMutation(
  withRemoveCommentReactionMutation(
    withCreateCommentReactionMutation(
      withFragmentContainer<ReactionButtonContainerProps>({
        viewer: graphql`
          fragment ReactionButtonContainer_viewer on User {
            id
          }
        `,
        comment: graphql`
          fragment ReactionButtonContainer_comment on Comment {
            id
            revision {
              id
            }
            viewerActionPresence {
              reaction
            }
            actionCounts {
              reaction {
                total
              }
            }
          }
        `,
        settings: graphql`
          fragment ReactionButtonContainer_settings on Settings {
            reaction {
              label
              labelActive
              icon
              iconActive
            }
          }
        `,
      })(ReactionButtonContainer)
    )
  )
);
