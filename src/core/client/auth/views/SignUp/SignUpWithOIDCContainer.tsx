import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import OIDCButton from "coral-framework/components/OIDCButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { SignUpWithOIDCContainer_auth as AuthData } from "coral-auth/__generated__/SignUpWithOIDCContainer_auth.graphql";

interface Props {
  auth: AuthData;
}

class SignUpWithOIDCContainer extends Component<Props> {
  private handleOnClick = () => {
    redirectOAuth2(this.props.auth.integrations.oidc.redirectURL!);
  };

  public render() {
    return (
      <Localized
        id="signUp-signUpWithOIDC"
        $name={this.props.auth.integrations.oidc.name}
      >
        <OIDCButton onClick={this.handleOnClick}>Sign in with $name</OIDCButton>
      </Localized>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignUpWithOIDCContainer_auth on Auth {
      integrations {
        oidc {
          name
          redirectURL
        }
      }
    }
  `,
})(SignUpWithOIDCContainer);

export default enhanced;
