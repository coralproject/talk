import { isValidHandle } from "@atproto/syntax";
import SignUpWithBskyForm, {
  SignUpWithBsky,
} from "coral-framework/components/BskySignUpForm";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { SignUpWithBskyContainer_auth as AuthData } from "coral-auth/__generated__/SignUpWithBskyContainer_auth.graphql";
import { REDIRECT_TO_PARAM } from "coral-common/common/lib/constants";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { BskyHandleInput, postBskyApiAuth } from "coral-framework/rest";
import qs from "querystringify";

interface Props {
  auth: AuthData;
}

const SignUpWithBskyContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window } = useCoralContext();
  // grab user origin so we can send back when done with auth
  const redirectTo = window.location.pathname;
  // get /api/auth/bsky route for tenant's bsky integration
  const authPath = `${auth.integrations.bsky.authURL}?${qs.stringify({
    [REDIRECT_TO_PARAM]: redirectTo,
  })}`;
  const onSubmit: SignUpWithBsky["onSubmit"] = useCallback(
    async (input, form) => {
      try {
        // catch invalid handle early before redirecting to /api/auth/bsky
        const handle = input.handle;
        const validHandle = isValidHandle(handle);
        if (validHandle) {
          return await postBskyApiAuth(input as BskyHandleInput, authPath);
        } else {
          return { [FORM_ERROR]: "Invalid handle" };
        }
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    },
    [authPath]
  );
  return <SignUpWithBskyForm onSubmit={onSubmit} />;
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignUpWithBskyContainer_auth on Auth {
      integrations {
        bsky {
          authURL
        }
      }
    }
  `,
})(SignUpWithBskyContainer);

export default enhanced;
