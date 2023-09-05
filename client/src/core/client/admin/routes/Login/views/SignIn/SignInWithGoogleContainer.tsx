import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import GoogleButton from "coral-framework/components/GoogleButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { SignInWithGoogleContainer_auth as AuthData } from "coral-admin/__generated__/SignInWithGoogleContainer_auth.graphql";
import { useCoralContext } from "coral-framework/lib/bootstrap";

interface Props {
  auth: AuthData;
}

const SignInWithGoogleContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window } = useCoralContext();
  const handleOnClick = useCallback(() => {
    redirectOAuth2(window, auth.integrations.google.redirectURL);
  }, [auth.integrations.google.redirectURL, window]);
  return (
    <Localized id="login-signInWithGoogle">
      <GoogleButton onClick={handleOnClick}>Sign in with Google</GoogleButton>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignInWithGoogleContainer_auth on Auth {
      integrations {
        google {
          redirectURL
        }
      }
    }
  `,
})(SignInWithGoogleContainer);

export default enhanced;
