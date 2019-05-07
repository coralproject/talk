import React, { Component } from "react";

import { SignInContainer_auth as AuthData } from "talk-auth/__generated__/SignInContainer_auth.graphql";
import { SignInContainerLocal as LocalData } from "talk-auth/__generated__/SignInContainerLocal.graphql";
import {
  ClearErrorMutation,
  SetViewMutation,
  SignInMutation,
  withClearErrorMutation,
  withSignInMutation,
} from "talk-auth/mutations";
import {
  graphql,
  MutationProp,
  withFragmentContainer,
  withLocalStateContainer,
  withMutation,
} from "talk-framework/lib/relay";

import { getViewURL } from "talk-auth/helpers";
import SignIn from "../components/SignIn";

interface Props {
  local: LocalData;
  auth: AuthData;
  signIn: SignInMutation;
  setView: MutationProp<typeof SetViewMutation>;
  clearError: ClearErrorMutation;
}

class SignInContainer extends Component<Props> {
  private goToSignUp = (e: React.MouseEvent) => {
    this.props.setView({ view: "SIGN_UP", history: "push" });
    if (e.preventDefault) {
      e.preventDefault();
    }
  };

  public componentWillUnmount() {
    this.props.clearError();
  }

  public render() {
    const integrations = this.props.auth.integrations;
    return (
      <SignIn
        error={this.props.local.error}
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
        oidcEnabled={
          integrations.oidc.enabled && integrations.oidc.targetFilter.stream
        }
        signUpHref={getViewURL("SIGN_UP")}
      />
    );
  }
}

const enhanced = withMutation(SetViewMutation)(
  withClearErrorMutation(
    withSignInMutation(
      withLocalStateContainer(
        graphql`
          fragment SignInContainerLocal on Local {
            error
          }
        `
      )(
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
    )
  )
);
export default enhanced;
