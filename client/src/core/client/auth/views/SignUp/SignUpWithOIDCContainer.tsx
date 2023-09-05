import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import OIDCButton from "coral-framework/components/OIDCButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { SignUpWithOIDCContainer_auth as AuthData } from "coral-auth/__generated__/SignUpWithOIDCContainer_auth.graphql";
import { useCoralContext } from "coral-framework/lib/bootstrap";

interface Props {
  auth: AuthData;
}

const SignUpWithOIDCContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window } = useCoralContext();
  const handleOnClick = useCallback(() => {
    redirectOAuth2(window, auth.integrations.oidc.redirectURL!);
  }, [auth.integrations.oidc.redirectURL, window]);
  return (
    <Localized
      id="signUp-signUpWithOIDC"
      vars={{ name: auth.integrations.oidc.name! }}
    >
      <OIDCButton onClick={handleOnClick}>Sign up with $name</OIDCButton>
    </Localized>
  );
};

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
