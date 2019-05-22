import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import { SignUpWithGoogleContainer_auth as AuthData } from "coral-auth/__generated__/SignUpWithGoogleContainer_auth.graphql";
import GoogleButton from "coral-framework/components/GoogleButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

interface Props {
  auth: AuthData;
}

class SignUpWithGoogleContainer extends Component<Props> {
  private handleOnClick = () => {
    redirectOAuth2(this.props.auth.integrations.google.redirectURL);
  };

  public render() {
    return (
      <Localized id="signUp-signUpWithGoogle">
        <GoogleButton onClick={this.handleOnClick}>
          Sign up with Google
        </GoogleButton>
      </Localized>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignUpWithGoogleContainer_auth on Auth {
      integrations {
        google {
          redirectURL
        }
      }
    }
  `,
})(SignUpWithGoogleContainer);

export default enhanced;
