import { isValidHandle } from "@atproto/syntax";
import { REDIRECT_TO_PARAM } from "coral-common/common/lib/constants";
import SignInWithAtprotoForm, {
  SignInWithAtproto,
} from "coral-framework/components/AtprotoLoginForm";
import {
  announceAuthHandoff,
  getAuthHandoffID,
} from "coral-framework/lib/auth/handoff";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { AtprotoHandleInput, postAtprotoApiAuth } from "coral-framework/rest";
import { FORM_ERROR } from "final-form";
import qs from "querystringify";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { SignInWithAtprotoContainer_auth as AuthData } from "coral-auth/__generated__/SignInWithAtprotoContainer_auth.graphql";

interface Props {
  auth: AuthData;
}

const SignInWithAtprotoContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window, postMessage, sessionStorage } = useCoralContext();
  const redirectTo = window.location.pathname;
  // get /api/auth/atproto route for tenant's Atproto integration
  const authPath = `${auth.integrations.atproto.authURL}?${qs.stringify({
    [REDIRECT_TO_PARAM]: redirectTo,
  })}`;
  const onSubmit: SignInWithAtproto["onSubmit"] = useCallback(
    async (input, form) => {
      try {
        // catch invalid handle early before redirecting to /api/auth/atproto
        const handle = input.handle;
        const validHandle = isValidHandle(handle);
        if (validHandle) {
          return await postAtprotoApiAuth(
            {
              ...(input as AtprotoHandleInput),
              handoff: await getAuthHandoffID(window, sessionStorage),
            },
            authPath,
            window,
            // Lets the page wait for this popup's token, as the sign in page
            // may cut this popup off from it (see the auth handoff).
            () => announceAuthHandoff(window, postMessage, sessionStorage)
          );
        } else {
          return { [FORM_ERROR]: "Invalid handle" };
        }
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    },
    [authPath, window, postMessage, sessionStorage]
  );
  return <SignInWithAtprotoForm onSubmit={onSubmit} />;
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignInWithAtprotoContainer_auth on Auth {
      integrations {
        atproto {
          authURL
        }
      }
    }
  `,
})(SignInWithAtprotoContainer);

export default enhanced;
