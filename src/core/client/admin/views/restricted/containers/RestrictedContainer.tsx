import { RouteProps } from "found";
import React, { Component } from "react";

import { RestrictedContainer_viewer as ViewerData } from "talk-admin/__generated__/RestrictedContainer_viewer.graphql";
import { SetRedirectPathMutation } from "talk-admin/mutations";
import { timeout } from "talk-common/utils";
import {
  graphql,
  MutationProp,
  withFragmentContainer,
  withMutation,
} from "talk-framework/lib/relay";
import { SignOutMutation, withSignOutMutation } from "talk-framework/mutations";

import Restricted from "../components/Restricted";

interface Props {
  viewer: ViewerData;
  error?: Error | null;
  signOut: SignOutMutation;
  setRedirectPath: MutationProp<typeof SetRedirectPathMutation>;
}

class RestrictedContainer extends Component<Props> {
  public static routeConfig: RouteProps;

  private handleSignInAs = async () => {
    await this.props.signOut();
    // Wait for new context to propagate.
    await timeout();
    this.props.setRedirectPath({
      path: location.pathname + location.search + location.hash,
    });
  };

  public render() {
    if (!this.props.viewer) {
      return null;
    }

    return (
      <Restricted
        username={this.props.viewer.username!}
        onSignInAs={this.handleSignInAs}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment RestrictedContainer_viewer on User {
      username
    }
  `,
})(
  withMutation(SetRedirectPathMutation)(
    withSignOutMutation(RestrictedContainer)
  )
);

export default enhanced;
