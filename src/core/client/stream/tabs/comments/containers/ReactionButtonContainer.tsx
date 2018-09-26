import React from "react";
import { graphql } from "react-relay";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { ReactionButtonContainer_comment as CommentData } from "talk-stream/__generated__/ReactionButtonContainer_comment.graphql";
import { ReactionButtonContainer_settings as SettingsData } from "talk-stream/__generated__/ReactionButtonContainer_settings.graphql";

import {
  CreateCommentReactionMutation,
  DeleteCommentReactionMutation,
  withCreateCommentReactionMutation,
  withDeleteCommentReactionMutation,
} from "talk-stream/mutations";
import ReactionButton from "talk-stream/tabs/comments/components/ReactionButton";

interface ReactionButtonContainerProps {
  createCommentReaction: CreateCommentReactionMutation;
  deleteCommentReaction: DeleteCommentReactionMutation;
  comment: CommentData;
  settings: SettingsData;
}

class ReactionButtonContainer extends React.Component<
  ReactionButtonContainerProps
> {
  private onButtonClick = () => {
    const input = {
      commentID: this.props.comment.id,
    };

    const { createCommentReaction, deleteCommentReaction } = this.props;
    const reacted =
      this.props.comment.myActionPresence &&
      this.props.comment.myActionPresence.reaction;

    return reacted
      ? deleteCommentReaction(input)
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
      this.props.comment.myActionPresence &&
      this.props.comment.myActionPresence.reaction;

    return (
      <ReactionButton
        onButtonClick={this.onButtonClick}
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

export default withDeleteCommentReactionMutation(
  withCreateCommentReactionMutation(
    withFragmentContainer<ReactionButtonContainerProps>({
      comment: graphql`
        fragment ReactionButtonContainer_comment on Comment {
          id
          myActionPresence {
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
);
