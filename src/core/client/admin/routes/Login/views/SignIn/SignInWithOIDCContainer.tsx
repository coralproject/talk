import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import OIDCButton from "coral-framework/components/OIDCButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { SignInWithOIDCContainer_auth as AuthData } from "coral-admin/__generated__/SignInWithOIDCContainer_auth.graphql";

interface Props {
  auth: AuthData;
}

const SignInWithOIDCContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window } = useCoralContext();
  const handleOnClick = useCallback(() => {
    redirectOAuth2(window, auth.integrations.oidc.redirectURL!);
  }, [auth.integrations.oidc.redirectURL, window]);

  return (
    <Localized
      id="login-signInWithOIDC"
      vars={{ name: auth.integrations.oidc.name }}
    >
      <OIDCButton onClick={handleOnClick}>Sign in with $name</OIDCButton>
    </Localized>
  );
};

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
