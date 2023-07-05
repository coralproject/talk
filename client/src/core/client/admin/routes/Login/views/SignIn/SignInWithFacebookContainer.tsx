import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import FacebookButton from "coral-framework/components/FacebookButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { SignInWithFacebookContainer_auth as AuthData } from "coral-admin/__generated__/SignInWithFacebookContainer_auth.graphql";
import { useCoralContext } from "coral-framework/lib/bootstrap";

interface Props {
  auth: AuthData;
}

const SignInWithFacebookContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window } = useCoralContext();
  const handleOnClick = useCallback(() => {
    redirectOAuth2(window, auth.integrations.facebook.redirectURL);
  }, [auth.integrations.facebook.redirectURL, window]);
  return (
    <Localized id="login-signInWithFacebook">
      <FacebookButton onClick={handleOnClick}>
        Sign in with Facebook
      </FacebookButton>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignInWithFacebookContainer_auth on Auth {
      integrations {
        facebook {
          redirectURL
        }
      }
    }
  `,
})(SignInWithFacebookContainer);

export default enhanced;
