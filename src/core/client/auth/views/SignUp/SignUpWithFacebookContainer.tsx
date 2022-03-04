import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import FacebookButton from "coral-framework/components/FacebookButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";

import { SignUpWithFacebookContainer_auth$key as AuthData } from "coral-auth/__generated__/SignUpWithFacebookContainer_auth.graphql";

interface Props {
  auth: AuthData;
}

const SignUpWithFacebookContainer: FunctionComponent<Props> = ({ auth }) => {
  const authData = useFragment(
    graphql`
      fragment SignUpWithFacebookContainer_auth on Auth {
        integrations {
          facebook {
            redirectURL
          }
        }
      }
    `,
    auth
  );

  const { window } = useCoralContext();
  const handleOnClick = useCallback(() => {
    redirectOAuth2(window, authData.integrations.facebook.redirectURL);
  }, [authData.integrations.facebook.redirectURL, window]);
  return (
    <Localized id="signUp-signUpWithFacebook">
      <FacebookButton onClick={handleOnClick}>
        Sign up with Facebook
      </FacebookButton>
    </Localized>
  );
};

export default SignUpWithFacebookContainer;
