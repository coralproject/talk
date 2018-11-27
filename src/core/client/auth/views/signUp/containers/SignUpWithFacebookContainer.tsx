import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import { SignUpWithFacebookContainer_auth as AuthData } from "talk-auth/__generated__/SignUpWithFacebookContainer_auth.graphql";
import FacebookButton from "talk-auth/components/FacebookButton";
import { redirectOAuth2 } from "talk-auth/helpers";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";

interface Props {
  auth: AuthData;
}

class SignUpWithFacebookContainer extends Component<Props> {
  private handleOnClick = () => {
    redirectOAuth2(this.props.auth.integrations.facebook.redirectURL);
  };

  public render() {
    return (
      <Localized id="signUp-signUpWithFacebook">
        <FacebookButton onClick={this.handleOnClick}>
          Sign up with Facebook
        </FacebookButton>
      </Localized>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignUpWithFacebookContainer_auth on Auth {
      integrations {
        facebook {
          redirectURL
        }
      }
    }
  `,
})(SignUpWithFacebookContainer);

export default enhanced;
