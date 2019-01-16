import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { ReportButtonContainer_comment as CommentData } from "talk-stream/__generated__/ReportButtonContainer_comment.graphql";
import { ReportButtonContainer_me as MeData } from "talk-stream/__generated__/ReportButtonContainer_me.graphql";

import {
  ReportButton,
  ReportButtonWithPopover,
} from "../components/ReportButton";

import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "talk-stream/mutations";

interface ReportButtonContainerProps {
  comment: CommentData;
  me: MeData | null;
  showAuthPopup: ShowAuthPopupMutation;
}

class ReportButtonContainer extends React.Component<
  ReportButtonContainerProps
> {
  private get loggedIn() {
    return this.props.me;
  }
  private handleSignIn = () => this.props.showAuthPopup({ view: "SIGN_IN" });

  public render() {
    const reported =
      this.props.comment.myActionPresence &&
      (this.props.comment.myActionPresence.flag ||
        this.props.comment.myActionPresence.dontAgree);

    return this.loggedIn ? (
      <ReportButtonWithPopover
        comment={this.props.comment}
        reported={!!reported}
      />
    ) : (
      <ReportButton onClick={this.handleSignIn} reported={!!reported} />
    );
  }
}

export default withShowAuthPopupMutation(
  withFragmentContainer<ReportButtonContainerProps>({
    me: graphql`
      fragment ReportButtonContainer_me on User {
        id
      }
    `,
    comment: graphql`
      fragment ReportButtonContainer_comment on Comment {
        ...ReportCommentFormContainer_comment
        id
        myActionPresence {
          dontAgree
          flag
        }
      }
    `,
  })(ReportButtonContainer)
);
