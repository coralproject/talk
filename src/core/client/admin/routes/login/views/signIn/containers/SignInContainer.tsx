import { RouteProps } from "found";
import React, { Component } from "react";

import { SignInContainer_auth as AuthData } from "talk-admin/__generated__/SignInContainer_auth.graphql";
import { SignInContainerLocal as LocalData } from "talk-admin/__generated__/SignInContainerLocal.graphql";
import { ClearAuthErrorMutation, SignInMutation } from "talk-admin/mutations";
import {
  graphql,
  MutationProp,
  withFragmentContainer,
  withLocalStateContainer,
  withMutation,
} from "talk-framework/lib/relay";

import SignIn from "../components/SignIn";

interface Props {
  local: LocalData;
  auth: AuthData;
  error?: Error | null;
  signIn: MutationProp<typeof SignInMutation>;
  clearAuthError: MutationProp<typeof ClearAuthErrorMutation>;
}

class SignInContainer extends Component<Props> {
  public static routeConfig: RouteProps;

  public componentWillUnmount() {
    this.props.clearAuthError();
  }

  public render() {
    const integrations = this.props.auth.integrations;
    return (
      <SignIn
        error={this.props.local.authError}
        auth={this.props.auth}
        emailEnabled={
          integrations.local.enabled && integrations.local.targetFilter.admin
        }
        facebookEnabled={
          integrations.facebook.enabled &&
          integrations.facebook.targetFilter.admin
        }
        googleEnabled={
          integrations.google.enabled && integrations.google.targetFilter.admin
        }
        oidcEnabled={
          integrations.oidc.enabled && integrations.oidc.targetFilter.admin
        }
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignInContainer_auth on Auth {
      ...SignInWithOIDCContainer_auth
      ...SignInWithGoogleContainer_auth
      ...SignInWithFacebookContainer_auth
      integrations {
        local {
          enabled
          targetFilter {
            admin
          }
        }
        facebook {
          enabled
          targetFilter {
            admin
          }
        }
        google {
          enabled
          targetFilter {
            admin
          }
        }
        oidc {
          enabled
          targetFilter {
            admin
          }
        }
      }
    }
  `,
})(
  withMutation(ClearAuthErrorMutation)(
    withMutation(SignInMutation)(
      withLocalStateContainer(
        graphql`
          fragment SignInContainerLocal on Local {
            authError
          }
        `
      )(SignInContainer)
    )
  )
);
export default enhanced;
