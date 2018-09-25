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

    // const { createCommentReaction, deleteCommentReaction } = this.props;
    // const { myActionPresence } = this.props.comment;

    // return myActionPresence
    //   ? deleteCommentReaction(input)
    //   : createCommentReaction(input);
    return this.props.createCommentReaction(input);
  };
  public render() {
    const {
      actionCounts: {
        reaction: { total },
      },
    } = this.props.comment;
    return <RespectButton onButtonClick={this.onButtonClick} total={total} />;
  }
}

export default withDeleteCommentReactionMutation(
  withCreateCommentReactionMutation(
    withFragmentContainer<RespectButtonContainerProps>({
      comment: graphql`
        fragment RespectButtonContainer_comment on Comment {
          id
          actionCounts {
            reaction {
              total
            }
          }
          myActionPresence {
            reaction
          }
        }
      `,
    })(RespectButtonContainer)
  )
);
