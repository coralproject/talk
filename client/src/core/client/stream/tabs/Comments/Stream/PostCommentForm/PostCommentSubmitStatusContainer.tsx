import React from "react";

import { SubmitStatus } from "../../helpers/getSubmitStatus";
import PostCommentInReviewMessage from "./PostCommentInReviewMessage";
import PostCommentRejectedMessage from "./PostCommentRejectedMessage";

interface Props {
  status: SubmitStatus | null;
}

interface State {
  dismissed: boolean;
}

export default class PostCommentSubmitStatusContainer extends React.Component<Props> {
  public state: State = {
    dismissed: false,
  };

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.status !== nextProps.status) {
      this.setState({ dismissed: false });
    }
  }

  private handleOnDismiss = () => {
    this.setState({ dismissed: true });
  };

  public render() {
    switch (this.props.status) {
      case "RETRY":
        throw new Error("Not implemented");
      case "REJECTED":
        return this.state.dismissed ? null : (
          <PostCommentRejectedMessage onDismiss={this.handleOnDismiss} />
        );
      case "IN_REVIEW":
        return this.state.dismissed ? null : (
          <PostCommentInReviewMessage onDismiss={this.handleOnDismiss} />
        );
      case "APPROVED":
      case null:
        return null;
      default:
        throw new Error(`Unknown status ${this.props.status}`);
    }
  }
}
