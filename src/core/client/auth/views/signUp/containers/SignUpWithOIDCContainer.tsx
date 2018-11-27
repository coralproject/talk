import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import { SignUpWithOIDCContainer_auth as AuthData } from "talk-auth/__generated__/SignUpWithOIDCContainer_auth.graphql";
import OIDCButton from "talk-auth/components/OIDCButton";
import { redirectOAuth2 } from "talk-auth/helpers";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";

interface Props {
  auth: AuthData;
}

class SignUpWithOIDCContainer extends Component<Props> {
  private handleOnClick = () => {
    redirectOAuth2(this.props.auth.integrations.oidc[0].redirectURL);
  };

  public render() {
    return (
      <Localized
        id="signUp-signUpWithOIDC"
        $name={this.props.auth.integrations.oidc[0].name}
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
