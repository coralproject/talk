import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import FacebookButton from "coral-framework/components/FacebookButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";

import { SignInWithFacebookContainer_auth$key as AuthData } from "coral-auth/__generated__/SignInWithFacebookContainer_auth.graphql";

interface Props {
  auth: AuthData;
}

const SignInWithFacebookContainer: FunctionComponent<Props> = ({ auth }) => {
  const authData = useFragment(
    graphql`
      fragment SignInWithFacebookContainer_auth on Auth {
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
    <Localized id="signIn-signInWithFacebook">
      <FacebookButton onClick={handleOnClick}>
        Sign in with Facebook
      </FacebookButton>
    </Localized>
  );
};

export default SignInWithFacebookContainer;
