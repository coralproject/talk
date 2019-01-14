import { RouteProps } from "found";
import React, { Component } from "react";

import { RestrictedContainer_me as MeData } from "talk-admin/__generated__/RestrictedContainer_me.graphql";
import {
  SetRedirectPathMutation,
  withSetRedirectPathMutation,
} from "talk-admin/mutations";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";
import { SignOutMutation, withSignOutMutation } from "talk-framework/mutations";

import { timeout } from "talk-common/utils";
import Restricted from "../components/Restricted";

interface Props {
  me: MeData;
  error?: Error | null;
  signOut: SignOutMutation;
  setRedirectPath: SetRedirectPathMutation;
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
    if (!this.props.me) {
      return null;
    }

    return (
      <Restricted
        username={this.props.me.username!}
        onSignInAs={this.handleSignInAs}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  me: graphql`
    fragment RestrictedContainer_me on User {
      username
    }
  `,
})(withSetRedirectPathMutation(withSignOutMutation(RestrictedContainer)));

export default enhanced;
