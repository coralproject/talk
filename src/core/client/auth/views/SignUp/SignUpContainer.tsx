import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { getViewURL } from "coral-auth/helpers";
import { SetViewMutation } from "coral-auth/mutations";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";

import { SignUpContainer_auth as AuthData } from "coral-auth/__generated__/SignUpContainer_auth.graphql";

import SignUp from "./SignUp";

interface Props {
  auth: AuthData;
}

const SignUpContainer: FunctionComponent<Props> = ({ auth }) => {
  const setView = useMutation(SetViewMutation);
  const goToSignIn = useCallback(
    (e: React.MouseEvent) => {
      setView({ view: "SIGN_IN", history: "push" });
      if (e.preventDefault) {
        e.preventDefault();
      }
    },
    [setView]
  );

  const integrations = auth.integrations;
  return (
    <SignUp
      signInHref={getViewURL("SIGN_IN")}
      auth={auth}
      onGotoSignIn={goToSignIn}
      emailEnabled={
        integrations.local.enabled &&
        integrations.local.targetFilter.stream &&
        integrations.local.allowRegistration
      }
      facebookEnabled={
        integrations.facebook.enabled &&
        integrations.facebook.targetFilter.stream &&
        integrations.facebook.allowRegistration
      }
      googleEnabled={
        integrations.google.enabled &&
        integrations.google.targetFilter.stream &&
        integrations.google.allowRegistration
      }
      oidcEnabled={
        integrations.oidc.enabled &&
        integrations.oidc.targetFilter.stream &&
        integrations.oidc.allowRegistration
      }
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment SignUpContainer_auth on Auth {
      ...SignUpWithOIDCContainer_auth
      ...SignUpWithGoogleContainer_auth
      ...SignUpWithFacebookContainer_auth
      integrations {
        local {
          enabled
          targetFilter {
            stream
          }
          allowRegistration
        }
        facebook {
          enabled
          targetFilter {
            stream
          }
          allowRegistration
        }
        google {
          enabled
          targetFilter {
            stream
          }
          allowRegistration
        }
        oidc {
          enabled
          targetFilter {
            stream
          }
          allowRegistration
        }
      }
    }
  `,
})(SignUpContainer);

export default enhanced;
