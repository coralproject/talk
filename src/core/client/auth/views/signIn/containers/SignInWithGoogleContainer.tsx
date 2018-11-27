import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import { SignInWithGoogleContainer_auth as AuthData } from "talk-auth/__generated__/SignInWithGoogleContainer_auth.graphql";
import GoogleButton from "talk-auth/components/GoogleButton";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";

interface Props {
  auth: AuthData;
}

class SignInWithGoogleContainer extends Component<Props> {
  private handleOnClick = () => {
    sessionStorage.setItem("authRedirectBackTo", window.location.pathname);
    window.location.href = this.props.auth.integrations.google.redirectURL;
  };

  public render() {
    return (
      <Localized id="signIn-signInWithGoogle">
        <GoogleButton onClick={this.handleOnClick}>
          Sign in with Google
        </GoogleButton>
      </Localized>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignInWithGoogleContainer_auth on Auth {
      integrations {
        google {
          redirectURL
        }
      }
    }
  `,
})(SignInWithGoogleContainer);

export default enhanced;
