import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import { SignInWithFacebookContainer_auth as AuthData } from "talk-auth/__generated__/SignInWithFacebookContainer_auth.graphql";
import FacebookButton from "talk-auth/components/FacebookButton";
import { redirectOAuth2 } from "talk-auth/helpers";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";

interface Props {
  auth: AuthData;
}

class SignInWithFacebookContainer extends Component<Props> {
  private handleOnClick = () => {
    redirectOAuth2(this.props.auth.integrations.facebook.redirectURL);
  };

  public render() {
    return (
      <Localized id="signIn-signInWithFacebook">
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
