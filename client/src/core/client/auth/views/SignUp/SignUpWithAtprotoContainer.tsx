import { isValidHandle } from "@atproto/syntax";
import SignUpWithAtprotoForm, {
  SignUpWithAtproto,
} from "coral-framework/components/AtprotoSignUpForm";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { SignUpWithAtprotoContainer_auth as AuthData } from "coral-auth/__generated__/SignUpWithAtprotoContainer_auth.graphql";
import { REDIRECT_TO_PARAM } from "coral-common/common/lib/constants";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { AtprotoHandleInput, postAtprotoApiAuth } from "coral-framework/rest";
import qs from "querystringify";

interface Props {
  auth: AuthData;
}

const SignUpWithAtprotoContainer: FunctionComponent<Props> = ({ auth }) => {
  const { window } = useCoralContext();
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
            input as AtprotoHandleInput,
            authPath
          );
        } else {
          return { [FORM_ERROR]: "Invalid handle" };
        }
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    },
    [authPath]
  );
  return <SignUpWithAtprotoForm onSubmit={onSubmit} />;
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignUpWithAtprotoContainer_auth on Auth {
      integrations {
        atproto {
          authURL
        }
      }
    }
  `,
})(SignUpWithAtprotoContainer);

export default enhanced;
