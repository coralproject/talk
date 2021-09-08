import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import FacebookButton from "coral-framework/components/FacebookButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { SignUpWithFacebookContainer_auth as AuthData } from "coral-auth/__generated__/SignUpWithFacebookContainer_auth.graphql";
import { useCoralContext } from "coral-framework/lib/bootstrap";

interface Props {
  auth: AuthData;
}

const SignUpWithFacebookContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window } = useCoralContext();
  const handleOnClick = useCallback(() => {
    redirectOAuth2(window, auth.integrations.facebook.redirectURL);
  }, [auth.integrations.facebook.redirectURL, window]);
  return (
    <Localized id="signUp-signUpWithFacebook">
      <FacebookButton onClick={handleOnClick}>
        Sign up with Facebook
      </FacebookButton>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignUpWithFacebookContainer_auth on Auth {
      integrations {
        facebook {
          redirectURL
        }
      }
    }
  `,
})(SignUpWithFacebookContainer);

export default enhanced;
