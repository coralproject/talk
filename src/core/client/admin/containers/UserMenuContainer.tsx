import React from "react";

import { UserMenuContainer_viewer as ViewerData } from "talk-admin/__generated__/UserMenuContainer_viewer.graphql";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";
import { SignOutMutation, withSignOutMutation } from "talk-framework/mutations";

import UserMenu from "../components/UserMenu";

interface Props {
  signOut: SignOutMutation;
  viewer: ViewerData | null;
}

class UserMenuContainer extends React.Component<Props> {
  private handleSignOut = () => this.props.signOut();
  public render() {
    return (
      <UserMenu
        onSignOut={this.handleSignOut}
        username={(this.props.viewer && this.props.viewer.username) || ""}
      />
    );
  }
}

const enhanced = withSignOutMutation(
  withFragmentContainer<Props>({
    viewer: graphql`
      fragment UserMenuContainer_viewer on User {
        username
      }
    `,
  })(UserMenuContainer)
);

export default enhanced;
