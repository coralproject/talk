import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import BskyButton from "coral-framework/components/BskyButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { SignUpWithBskyContainer_auth as AuthData } from "coral-auth/__generated__/SignUpWithBskyContainer_auth.graphql";
import { useCoralContext } from "coral-framework/lib/bootstrap";

interface Props {
  auth: AuthData;
}

const SignUpWithBskyContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window } = useCoralContext();
  const handleOnClick = useCallback(() => {
    redirectOAuth2(window, auth.integrations.bsky.redirectURL);
  }, [auth.integrations.bsky.redirectURL, window]);
  return (
    <Localized id="signUp-signUpWithBsky">
      <BskyButton onClick={handleOnClick}>
        Sign up with Bluesky
      </BskyButton>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignUpWithBskyContainer_auth on Auth {
      integrations {
        bsky {
          redirectURL
        }
      }
    }
  `,
})(SignUpWithBskyContainer);

export default enhanced;
