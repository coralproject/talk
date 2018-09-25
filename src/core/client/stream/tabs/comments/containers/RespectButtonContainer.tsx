import React from "react";
import { graphql } from "react-relay";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { RespectButtonContainer_comment as CommentData } from "talk-stream/__generated__/RespectButtonContainer_comment.graphql";

import {
  CreateCommentReactionMutation,
  withCreateCommentReactionMutation,
} from "../../../mutations";
import RespectButton from "../components/RespectButton";

interface RespectButtonContainerProps {
  createCommentReaction: CreateCommentReactionMutation;
  comment: CommentData;
}

class RespectButtonContainer extends React.Component<
  RespectButtonContainerProps
> {
  private onButtonClick = () =>
    this.props.createCommentReaction({
      commentID: this.props.comment.id,
    });
  public render() {
    const {
      actionCounts: {
        reaction: { total },
      },
    } = this.props.comment;
    return <RespectButton onButtonClick={this.onButtonClick} total={total} />;
  }
}

export default withCreateCommentReactionMutation(
  withFragmentContainer<RespectButtonContainerProps>({
    comment: graphql`
      fragment RespectButtonContainer_comment on Comment {
        id
        actionCounts {
          reaction {
            total
          }
        }
      }
    `,
  })(RespectButtonContainer)
);
