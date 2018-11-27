import React, { Component } from "react";

import { SignInContainer_auth as AuthData } from "talk-auth/__generated__/SignInContainer_auth.graphql";
import {
  SetViewMutation,
  SignInMutation,
  withSetViewMutation,
  withSignInMutation,
} from "talk-auth/mutations";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";

import SignIn from "../components/SignIn";

interface Props {
  auth: AuthData;
  signIn: SignInMutation;
  setView: SetViewMutation;
}

class SignInContainer extends Component<Props> {
  private goToSignUp = () => this.props.setView({ view: "SIGN_UP" });
  public render() {
    const integrations = this.props.auth.integrations;
    return (
      <SignIn
        auth={this.props.auth}
        onGotoSignUp={this.goToSignUp}
        emailEnabled={
          integrations.local.enabled && integrations.local.targetFilter.stream
        }
        facebookEnabled={
          integrations.facebook.enabled &&
          integrations.facebook.targetFilter.stream
        }
        googleEnabled={
          integrations.google.enabled && integrations.google.targetFilter.stream
        }
        oidcEnabled={integrations.oidc.some(
          i => i.enabled && i.targetFilter.stream
        )}
      />
    );
  }
}

const enhanced = withSetViewMutation(
  withSignInMutation(
    withFragmentContainer<Props>({
      auth: graphql`
        fragment SignInContainer_auth on Auth {
          ...SignInWithOIDCContainer_auth
          ...SignInWithGoogleContainer_auth
          ...SignInWithFacebookContainer_auth
          integrations {
            local {
              enabled
              targetFilter {
                stream
              }
            }
            facebook {
              enabled
              targetFilter {
                stream
              }
            }
            google {
              enabled
              targetFilter {
                stream
              }
            }
            oidc {
              enabled
              targetFilter {
                stream
              }
            }
          }
        }
      `,
    })(SignInContainer)
  )
);
export default enhanced;
