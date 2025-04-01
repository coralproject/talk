import { isValidHandle } from "@atproto/syntax";
import SignInWithBsky, {
  SignInWithBskyForm,
} from "coral-framework/components/BskyLoginForm";
import { redirectOAuth2 } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { SignInWithBskyContainer_auth as AuthData } from "coral-auth/__generated__/SignInWithBskyContainer_auth.graphql";

interface Props {
  auth: AuthData;
  handle: string;
}

const SignInWithBskyContainer: FunctionComponent<Props> = ({
  auth,
  handle,
}) => {
  const { window } = useCoralContext();
  const onSubmit: SignInWithBskyForm["onSubmit"] = useCallback(async () => {
    try {
      const validHandle = isValidHandle(handle);
      if (validHandle) {
        return redirectOAuth2(window, auth.integrations.bsky.redirectURL);
      } else {
        new Error("Invalid Handle");
      }
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  }, [auth.integrations.bsky.redirectURL, handle, window]);
  return <SignInWithBsky onSubmit={onSubmit} />;
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
