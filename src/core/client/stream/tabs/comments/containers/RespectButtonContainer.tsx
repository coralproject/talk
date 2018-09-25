import React from "react";

import {
  CreateCommentReactionMutation,
  withCreateCommentReactionMutation,
} from "../../../mutations";
import RespectButton from "../components/RespectButton";

interface RespectButtonContainerProps {
  createCommentReaction: CreateCommentReactionMutation;
  commentID: string;
}

class RespectButtonContainer extends React.Component<
  RespectButtonContainerProps
> {
  private onButtonClick = () =>
    this.props.createCommentReaction({
      commentID: this.props.commentID,
    });
  public render() {
    return <RespectButton onButtonClick={this.onButtonClick} />;
  }
}

export default withCreateCommentReactionMutation(RespectButtonContainer);
