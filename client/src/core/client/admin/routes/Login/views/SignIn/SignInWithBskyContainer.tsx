import { isValidHandle } from "@atproto/syntax";
import { SignInWithBskyContainer_auth as AuthData } from "coral-admin/__generated__/SignInWithBskyContainer_auth.graphql";
import { REDIRECT_TO_PARAM } from "coral-common/common/lib/constants";
import SignInWithBskyForm, {
  SignInWithBsky,
} from "coral-framework/components/BskyLoginForm";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { BskyHandleInput, postBskyApiAuth } from "coral-framework/rest";
import { FORM_ERROR } from "final-form";
import qs from "querystringify";
import React, { FormEvent, FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

interface Props {
  auth: AuthData;
}

const SignInWithBskyContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window } = useCoralContext();
  // grab user origin so we can send back when done with auth
  const redirectTo = window.location.pathname;
  // get /api/auth/bsky route for tenant's bsky integration
  const authPath = `${auth.integrations.bsky.authURL}?${qs.stringify({
    [REDIRECT_TO_PARAM]: redirectTo,
  })}`;
  const onSubmit: SignInWithBsky["onSubmit"] = useCallback(
    async (input, form) => {
      try {
        // catch invalid handle early before redirecting to /api/auth/bsky
        const handle = input.handle;
        const validHandle = isValidHandle(handle as string);
        if (validHandle) {
          await postBskyApiAuth(input as BskyHandleInput, authPath);
          return;
        } else {
          return { [FORM_ERROR]: "Invalid handle" };
        }
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    },
    [authPath]
  );
  return <SignInWithBskyForm onSubmit={onSubmit} />;
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignInWithBskyContainer_auth on Auth {
      integrations {
        bsky {
          authURL
        }
      }
    }
  `,
})(SignInWithBskyContainer);

export default enhanced;
