import React from "react";

import { UserMenuContainer_me as MeData } from "talk-admin/__generated__/UserMenuContainer_me.graphql";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";
import { SignOutMutation, withSignOutMutation } from "talk-framework/mutations";

import UserMenu from "../components/UserMenu";

interface Props {
  signOut: SignOutMutation;
  me: MeData | null;
}

class UserMenuContainer extends React.Component<Props> {
  private handleSignOut = () => this.props.signOut();
  public render() {
    return (
      <UserMenu
        onSignOut={this.handleSignOut}
        username={(this.props.me && this.props.me.username) || ""}
      />
    );
  }
}

const enhanced = withSignOutMutation(
  withFragmentContainer<Props>({
    me: graphql`
      fragment UserMenuContainer_me on User {
        username
      }
    `,
  })(UserMenuContainer)
);

export default enhanced;
