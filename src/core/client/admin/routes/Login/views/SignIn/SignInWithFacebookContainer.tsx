import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import { SignInWithFacebookContainer_auth as AuthData } from "coral-admin/__generated__/SignInWithFacebookContainer_auth.graphql";
import FacebookButton from "coral-framework/components/FacebookButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

interface Props {
  auth: AuthData;
  autoRedirect: boolean;
}

class SignInWithFacebookContainer extends Component<Props> {
  private handleOnClick = () => {
    redirectOAuth2(this.props.auth.integrations.facebook.redirectURL);
  };

  public render() {
    if (this.props.autoRedirect) {
      redirectOAuth2(this.props.auth.integrations.facebook.redirectURL!);
      return null;
    }
    return (
      <Localized id="login-signInWithFacebook">
        <FacebookButton onClick={this.handleOnClick}>
          Sign in with Facebook
        </FacebookButton>
      </Localized>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignInWithFacebookContainer_auth on Auth {
      integrations {
        facebook {
          redirectURL
        }
      }
    }
  `,
})(SignInWithFacebookContainer);

export default enhanced;
