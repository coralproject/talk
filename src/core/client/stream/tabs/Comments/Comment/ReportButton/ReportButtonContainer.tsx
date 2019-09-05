import cn from "classnames";
import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { ReportButtonContainer_comment as CommentData } from "coral-stream/__generated__/ReportButtonContainer_comment.graphql";
import { ReportButtonContainer_viewer as ViewerData } from "coral-stream/__generated__/ReportButtonContainer_viewer.graphql";

import ReportButton from "./ReportButton";
import ReportButtonWithPopover from "./ReportButtonWithPopover";

import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "coral-stream/mutations";

interface ReportButtonContainerProps {
  comment: CommentData;
  viewer: ViewerData | null;
  showAuthPopup: ShowAuthPopupMutation;
  className?: string;
  reportedClassName?: string;
}

class ReportButtonContainer extends React.Component<
  ReportButtonContainerProps
> {
  private get loggedIn() {
    return Boolean(this.props.viewer);
  }
  private handleSignIn = () => this.props.showAuthPopup({ view: "SIGN_IN" });

  public render() {
    const { className, reportedClassName = "" } = this.props;
    const reported =
      this.props.comment.viewerActionPresence &&
      (this.props.comment.viewerActionPresence.flag ||
        this.props.comment.viewerActionPresence.dontAgree);

    return this.loggedIn ? (
      <ReportButtonWithPopover
        className={cn(className, { [reportedClassName]: Boolean(reported) })}
        comment={this.props.comment}
        reported={!!reported}
      />
    ) : (
      <ReportButton
        className={cn(className, { [reportedClassName]: Boolean(reported) })}
        onClick={this.handleSignIn}
        reported={Boolean(reported)}
      />
    );
  }
}

export default withShowAuthPopupMutation(
  withFragmentContainer<ReportButtonContainerProps>({
    viewer: graphql`
      fragment ReportButtonContainer_viewer on User {
        id
      }
    `,
    comment: graphql`
      fragment ReportButtonContainer_comment on Comment {
        ...ReportCommentFormContainer_comment
        id
        viewerActionPresence {
          dontAgree
          flag
        }
      }
    `,
  })(ReportButtonContainer)
);
