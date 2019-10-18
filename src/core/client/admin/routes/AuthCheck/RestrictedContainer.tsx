import { RouteProps } from "found";
import React, { Component } from "react";

import { SetRedirectPathMutation } from "coral-admin/mutations";
import { timeout } from "coral-common/utils";
import {
  graphql,
  MutationProp,
  withFragmentContainer,
  withMutation,
} from "coral-framework/lib/relay";
import {
  SignOutMutation,
  withSignOutMutation,
} from "coral-framework/mutations";

import { RestrictedContainer_viewer as ViewerData } from "coral-admin/__generated__/RestrictedContainer_viewer.graphql";

import Restricted from "./Restricted";

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
