import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import GoogleButton from "coral-framework/components/GoogleButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";

import { SignInWithGoogleContainer_auth$key as AuthData } from "coral-auth/__generated__/SignInWithGoogleContainer_auth.graphql";

interface Props {
  auth: AuthData;
}

const SignInWithGoogleContainer: FunctionComponent<Props> = ({ auth }) => {
  const authData = useFragment(
    graphql`
      fragment SignInWithGoogleContainer_auth on Auth {
        integrations {
          google {
            redirectURL
          }
        }
      }
    `,
    auth
  );
  const { window } = useCoralContext();
  const handleOnClick = useCallback(() => {
    redirectOAuth2(window, authData.integrations.google.redirectURL);
  }, [authData.integrations.google.redirectURL, window]);
  return (
    <Localized id="signIn-signInWithGoogle">
      <GoogleButton onClick={handleOnClick}>Sign in with Google</GoogleButton>
    </Localized>
  );
};

export default SignInWithGoogleContainer;
