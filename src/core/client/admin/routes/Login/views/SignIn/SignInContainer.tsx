import React, { FunctionComponent, useEffect } from "react";
import { graphql, useFragment } from "react-relay";

import { useLocal, useMutation } from "coral-framework/lib/relay";

import { SignInContainer_auth$key as AuthData } from "coral-admin/__generated__/SignInContainer_auth.graphql";
import { SignInContainerLocal } from "coral-admin/__generated__/SignInContainerLocal.graphql";

import ClearAuthErrorMutation from "./ClearAuthErrorMutation";
import SignIn from "./SignIn";

interface Props {
  auth: AuthData;
}

const SignInContainer: FunctionComponent<Props> = ({ auth }) => {
  const authData = useFragment(
    graphql`
      fragment SignInContainer_auth on Auth {
        ...SignInWithOIDCContainer_auth
        ...SignInWithGoogleContainer_auth
        ...SignInWithFacebookContainer_auth
        integrations {
          local {
            enabled
            targetFilter {
              admin
            }
          }
          facebook {
            enabled
            targetFilter {
              admin
            }
          }
          google {
            enabled
            targetFilter {
              admin
            }
          }
          oidc {
            enabled
            targetFilter {
              admin
            }
          }
        }
      }
    `,
    auth
  );

  const { integrations } = authData;
  const clearAuthError = useMutation(ClearAuthErrorMutation);
  const [{ authError }] = useLocal<SignInContainerLocal>(graphql`
    fragment SignInContainerLocal on Local {
      authError
    }
  `);
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  return (
    <SignIn
      error={authError}
      auth={authData}
      emailEnabled={
        integrations.local.enabled && integrations.local.targetFilter.admin
      }
      facebookEnabled={
        integrations.facebook.enabled &&
        integrations.facebook.targetFilter.admin
      }
      googleEnabled={
        integrations.google.enabled && integrations.google.targetFilter.admin
      }
      oidcEnabled={
        integrations.oidc.enabled && integrations.oidc.targetFilter.admin
      }
    />
  );
};

export default SignInContainer;
