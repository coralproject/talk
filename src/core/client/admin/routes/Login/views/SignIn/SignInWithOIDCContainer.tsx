import { Localized } from "@fluent/react/compat";
import React, { Component } from "react";
import { graphql } from "react-relay";

import OIDCButton from "coral-framework/components/OIDCButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { SignInWithOIDCContainer_auth as AuthData } from "coral-admin/__generated__/SignInWithOIDCContainer_auth.graphql";

interface Props {
  auth: AuthData;
}

class SignInWithOIDCContainer extends Component<Props> {
  private handleOnClick = () => {
    redirectOAuth2(this.props.auth.integrations.oidc.redirectURL!);
  };

  public render() {
    return (
      <Localized
        id="login-signInWithOIDC"
        $name={this.props.auth.integrations.oidc.name}
      >
        <OIDCButton onClick={this.handleOnClick}>Sign in with $name</OIDCButton>
      </Localized>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignInWithOIDCContainer_auth on Auth {
      integrations {
        oidc {
          name
          redirectURL
        }
      }
    }
  `,
})(SignInWithOIDCContainer);

export default enhanced;
