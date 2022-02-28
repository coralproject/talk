import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import OIDCButton from "coral-framework/components/OIDCButton";
import { redirectOAuth2 } from "coral-framework/helpers";

import { SignInWithOIDCContainer_auth$key as AuthData } from "coral-auth/__generated__/SignInWithOIDCContainer_auth.graphql";
import { useCoralContext } from "coral-framework/lib/bootstrap";

interface Props {
  auth: AuthData;
}

const SignInWithOIDCContainer: FunctionComponent<Props> = ({ auth }) => {
  const authData = useFragment(
    graphql`
      fragment SignInWithOIDCContainer_auth on Auth {
        integrations {
          oidc {
            name
            redirectURL
          }
        }
      }
    `,
    auth
  );
  const { window } = useCoralContext();
  const handleOnClick = useCallback(() => {
    redirectOAuth2(window, authData.integrations.oidc.redirectURL!);
  }, [authData.integrations.oidc.redirectURL, window]);
  return (
    <Localized
      id="signIn-signInWithOIDC"
      $name={authData.integrations.oidc.name}
    >
      <OIDCButton onClick={handleOnClick}>Sign in with $name</OIDCButton>
    </Localized>
  );
};

export default SignInWithOIDCContainer;
