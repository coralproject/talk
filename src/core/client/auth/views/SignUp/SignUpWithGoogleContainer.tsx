import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import GoogleButton from "coral-framework/components/GoogleButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";

import { SignUpWithGoogleContainer_auth$key as AuthData } from "coral-auth/__generated__/SignUpWithGoogleContainer_auth.graphql";

interface Props {
  auth: AuthData;
}

const SignUpWithGoogleContainer: FunctionComponent<Props> = ({ auth }) => {
  const authData = useFragment(
    graphql`
      fragment SignUpWithGoogleContainer_auth on Auth {
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
    <Localized id="signUp-signUpWithGoogle">
      <GoogleButton onClick={handleOnClick}>Sign up with Google</GoogleButton>
    </Localized>
  );
};

export default SignUpWithGoogleContainer;
