import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import BskyButton from "coral-framework/components/BskyButton";
import { redirectOAuth2 } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { SignInWithBskyContainer_auth as AuthData } from "coral-admin/__generated__/SignInWithBskyContainer_auth.graphql";
import { useCoralContext } from "coral-framework/lib/bootstrap";

interface Props {
  auth: AuthData;
}

const SignInWithBskyContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window } = useCoralContext();
  const handleOnClick = useCallback(() => {
    redirectOAuth2(window, auth.integrations.bsky.redirectURL);
  }, [auth.integrations.bsky.redirectURL, window]);
  return (
    <Localized id="login-signInWithBsky">
      <BskyButton onClick={handleOnClick}>
        Sign in with Bluesky
      </BskyButton>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignInWithBskyContainer_auth on Auth {
      integrations {
        bsky {
          redirectURL
        }
      }
    }
  `,
})(SignInWithBskyContainer);

export default enhanced;
