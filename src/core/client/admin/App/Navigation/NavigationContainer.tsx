import React from "react";

import { Ability, can } from "coral-admin/permissions";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import {
  SignOutMutation,
  withSignOutMutation,
} from "coral-framework/mutations";

import { NavigationContainer_viewer as ViewerData } from "coral-admin/__generated__/NavigationContainer_viewer.graphql";

import Navigation from "./Navigation";

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
