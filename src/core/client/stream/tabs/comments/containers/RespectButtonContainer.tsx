import React from "react";
import { graphql } from "react-relay";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { RespectButtonContainer_comment as CommentData } from "talk-stream/__generated__/RespectButtonContainer_comment.graphql";

import {
  CreateCommentReactionMutation,
  DeleteCommentReactionMutation,
  withCreateCommentReactionMutation,
  withDeleteCommentReactionMutation,
} from "../../../mutations";
import RespectButton from "../components/RespectButton";

interface RespectButtonContainerProps {
  createCommentReaction: CreateCommentReactionMutation;
  deleteCommentReaction: DeleteCommentReactionMutation;
  comment: CommentData;
}

class RespectButtonContainer extends React.Component<
  RespectButtonContainerProps
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

    const reacted =
      this.props.comment.myActionPresence &&
      this.props.comment.myActionPresence.reaction;

    return (
      <RespectButton
        onButtonClick={this.onButtonClick}
        totalReactions={totalReactions}
        reacted={reacted}
      />
    );
  }
}

export default withDeleteCommentReactionMutation(
  withCreateCommentReactionMutation(
    withFragmentContainer<RespectButtonContainerProps>({
      comment: graphql`
        fragment RespectButtonContainer_comment on Comment {
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
    })(RespectButtonContainer)
  )
);
