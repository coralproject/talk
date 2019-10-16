import cn from "classnames";
import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "coral-stream/mutations";

import { ReactionButtonContainer_comment as CommentData } from "coral-stream/__generated__/ReactionButtonContainer_comment.graphql";
import { ReactionButtonContainer_settings as SettingsData } from "coral-stream/__generated__/ReactionButtonContainer_settings.graphql";
import { ReactionButtonContainer_viewer as ViewerData } from "coral-stream/__generated__/ReactionButtonContainer_viewer.graphql";

import {
  CreateCommentReactionMutation,
  withCreateCommentReactionMutation,
} from "./CreateCommentReactionMutation";
import ReactionButton from "./ReactionButton";
import {
  RemoveCommentReactionMutation,
  withRemoveCommentReactionMutation,
} from "./RemoveCommentReactionMutation";

interface Props {
  createCommentReaction: CreateCommentReactionMutation;
  removeCommentReaction: RemoveCommentReactionMutation;
  comment: CommentData;
  settings: SettingsData;
  viewer: ViewerData | null;
  showAuthPopup: ShowAuthPopupMutation;
  readOnly?: boolean;
  className?: string;
  reactedClassName?: string;
}

class ReactionButtonContainer extends React.Component<Props> {
  private handleSignIn = () => this.props.showAuthPopup({ view: "SIGN_IN" });

  private handleClick = () => {
    if (this.props.viewer === null) {
      return this.handleSignIn();
    }

    const input = {
      commentID: this.props.comment.id,
      // can assume revision is not null as we
      // tombstone when comment revisions don't exist
      commentRevisionID: this.props.comment.revision!.id,
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
    const { readOnly, className, reactedClassName = "" } = this.props;
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

    return !readOnly || totalReactions > 0 ? (
      <ReactionButton
        className={cn(className, { [reactedClassName]: reacted })}
        onClick={this.handleClick}
        totalReactions={totalReactions}
        reacted={reacted}
        label={label}
        labelActive={labelActive}
        icon={icon}
        iconActive={iconActive}
        readOnly={readOnly}
      />
    ) : null;
  }
}

export default withShowAuthPopupMutation(
  withRemoveCommentReactionMutation(
    withCreateCommentReactionMutation(
      withFragmentContainer<Props>({
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
