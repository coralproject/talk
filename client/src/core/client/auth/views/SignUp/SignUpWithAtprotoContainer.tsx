import { isValidHandle } from "@atproto/syntax";
import SignUpWithAtprotoForm, {
  SignUpWithAtproto,
} from "coral-framework/components/AtprotoSignUpForm";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { SignUpWithAtprotoContainer_auth as AuthData } from "coral-auth/__generated__/SignUpWithAtprotoContainer_auth.graphql";
import { REDIRECT_TO_PARAM } from "coral-common/common/lib/constants";
import {
  announceAuthHandoff,
  getAuthHandoffID,
} from "coral-framework/lib/auth/handoff";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { AtprotoHandleInput, postAtprotoApiAuth } from "coral-framework/rest";
import qs from "querystringify";

interface Props {
  auth: AuthData;
}

const SignUpWithAtprotoContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window, postMessage, sessionStorage } = useCoralContext();
  // grab user origin so we can send back when done with auth
  const redirectTo = window.location.pathname;
  // get /api/auth/atproto route for tenant's atproto integration
  const authPath = `${auth.integrations.atproto.authURL}?${qs.stringify({
    [REDIRECT_TO_PARAM]: redirectTo,
  })}`;
  const onSubmit: SignUpWithAtproto["onSubmit"] = useCallback(
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
  return (
    <SignUpWithAtprotoForm
      onSubmit={onSubmit}
      typeaheadHost={auth.integrations.atproto.typeaheadHost}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignUpWithAtprotoContainer_auth on Auth {
      integrations {
        atproto {
          authURL
          typeaheadHost
        }
      }
    }
  `,
})(SignUpWithAtprotoContainer);

export default enhanced;
