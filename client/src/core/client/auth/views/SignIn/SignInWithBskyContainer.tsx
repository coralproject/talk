import { isValidHandle } from "@atproto/syntax";
import { REDIRECT_TO_PARAM } from "coral-common/common/lib/constants";
import SignInWithBskyForm, {
  SignInWithBsky,
} from "coral-framework/components/BskyLoginForm";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { postBskyApiAuth } from "coral-framework/rest";
import { FORM_ERROR } from "final-form";
import qs from "querystringify";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { SignInWithBskyContainer_auth as AuthData } from "coral-auth/__generated__/SignInWithBskyContainer_auth.graphql";

interface Props {
  auth: AuthData;
}

const SignInWithBskyContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window, rest } = useCoralContext();
  const redirectTo = window.location.pathname;
  // get /api/auth/bsky route for tenant's bsky integration
  const authPath = `${auth.integrations.bsky.redirectURL}?${qs.stringify({
    [REDIRECT_TO_PARAM]: redirectTo,
  })}`;
  const onSubmit: SignInWithBsky["onSubmit"] = useCallback(
    async (input, form) => {
      try {
       // catch invalid handle early before redirecting to /api/auth/bsky
        const handle = input.handle;
        const validHandle = isValidHandle(handle as string);
        if (validHandle) {
          return await postBskyApiAuth(rest, input.input, authPath);
        } else {
          return { [FORM_ERROR]: "Invalid handle" };
        }
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    }
  );
  return <SignInWithBskyForm onSubmit={onSubmit} />;
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
