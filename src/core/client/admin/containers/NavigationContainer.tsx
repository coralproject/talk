import React from "react";

import { NavigationContainer_viewer as ViewerData } from "talk-admin/__generated__/NavigationContainer_viewer.graphql";
import { Ability, can } from "talk-admin/permissions";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";
import { SignOutMutation, withSignOutMutation } from "talk-framework/mutations";

import Navigation from "../components/Navigation";

interface Props {
  signOut: SignOutMutation;
  viewer: ViewerData | null;
}

class NavigationContainer extends React.Component<Props> {
  public render() {
    return (
      <Navigation
        showConfigure={
          !!this.props.viewer &&
          can(this.props.viewer, Ability.CHANGE_CONFIGURATION)
        }
      />
    );
  }
}

const enhanced = withSignOutMutation(
  withFragmentContainer<Props>({
    viewer: graphql`
      fragment NavigationContainer_viewer on User {
        role
      }
    `,
  })(NavigationContainer)
);

export default enhanced;
