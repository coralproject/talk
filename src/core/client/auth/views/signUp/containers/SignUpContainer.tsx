import React, { Component } from "react";

import { SignUpContainer_auth as AuthData } from "talk-auth/__generated__/SignUpContainer_auth.graphql";
import { SetViewMutation, withSetViewMutation } from "talk-auth/mutations";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";

import SignUp from "../components/SignUp";

interface Props {
  auth: AuthData;
  setView: SetViewMutation;
}

class SignUpContainer extends Component<Props> {
  private goToSignIn = () => this.props.setView({ view: "SIGN_IN" });
  public render() {
    const integrations = this.props.auth.integrations;
    return (
      <SignUp
        auth={this.props.auth}
        onGotoSignIn={this.goToSignIn}
        emailEnabled={
          integrations.local.enabled &&
          integrations.local.targetFilter.admin &&
          integrations.local.allowRegistration
        }
        facebookEnabled={
          integrations.facebook.enabled &&
          integrations.facebook.targetFilter.admin &&
          integrations.facebook.allowRegistration
        }
        googleEnabled={
          integrations.google.enabled &&
          integrations.google.targetFilter.admin &&
          integrations.google.allowRegistration
        }
        oidcEnabled={integrations.oidc.some(
          i => i.enabled && i.targetFilter.admin && i.allowRegistration
        )}
      />
    );
  }
}

const enhanced = withSetViewMutation(
  withFragmentContainer<Props>({
    auth: graphql`
      fragment SignUpContainer_auth on Auth {
        ...SignUpWithOIDCContainer_auth
        ...SignUpWithGoogleContainer_auth
        ...SignUpWithFacebookContainer_auth
        integrations {
          local {
            enabled
            targetFilter {
              admin
            }
            allowRegistration
          }
          facebook {
            enabled
            targetFilter {
              admin
            }
            allowRegistration
          }
          google {
            enabled
            targetFilter {
              admin
            }
            allowRegistration
          }
          oidc {
            enabled
            targetFilter {
              admin
            }
            allowRegistration
          }
        }
      }
    `,
  })(SignUpContainer)
);
export default enhanced;
