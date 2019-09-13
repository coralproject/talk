import React, { FunctionComponent, useCallback, useEffect } from "react";

import { SignInContainer_auth as AuthData } from "coral-auth/__generated__/SignInContainer_auth.graphql";
import { SignInContainerLocal as LocalData } from "coral-auth/__generated__/SignInContainerLocal.graphql";
import { getViewURL } from "coral-auth/helpers";
import { SetViewMutation } from "coral-auth/mutations";
import { redirectOAuth2 } from "coral-framework/helpers";
import {
  graphql,
  useMutation,
  withFragmentContainer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";

import {
  ClearErrorMutation,
  withClearErrorMutation,
} from "./ClearErrorMutation";
import SignIn from "./SignIn";
import { SignInMutation, withSignInMutation } from "./SignInMutation";

interface Props {
  local: LocalData;
  auth: AuthData;
  signIn: SignInMutation;
  clearError: ClearErrorMutation;
}

const SignInContainer: FunctionComponent<Props> = ({
  auth,
  local,
  clearError,
}) => {
  const setView = useMutation(SetViewMutation);
  const goToSignUp = useCallback(
    (e: React.MouseEvent) => {
      setView({ view: "SIGN_UP", history: "push" });
      if (e.preventDefault) {
        e.preventDefault();
      }
    },
    [setView]
  );

  useEffect(() => {
    return () => {
      // Clear the error when we unmount.
      clearError();
    };
  }, [clearError, auth]);

  // If there's only one enabled auth integration, we should just perform
  // the redirect now.
  if (
    !auth.integrations.local.enabled ||
    !auth.integrations.local.targetFilter.stream
  ) {
    // Local isn't enabled, so we can look into the rest of the integrations
    // now.
    const { facebook, google, oidc } = auth.integrations;
    const enabledIntegrations = [facebook, google, oidc].filter(
      ({ enabled, targetFilter: { stream } }) => enabled && stream
    );
    if (
      enabledIntegrations.length === 1 &&
      enabledIntegrations[0].redirectURL
    ) {
      redirectOAuth2(enabledIntegrations[0].redirectURL);

      return null;
    }
  }

  const integrations = auth.integrations;
  return (
    <SignIn
      error={local.error}
      auth={auth}
      onGotoSignUp={goToSignUp}
      emailEnabled={
        integrations.local.enabled && integrations.local.targetFilter.stream
      }
      facebookEnabled={
        integrations.facebook.enabled &&
        integrations.facebook.targetFilter.stream
      }
      googleEnabled={
        integrations.google.enabled && integrations.google.targetFilter.stream
      }
      oidcEnabled={
        integrations.oidc.enabled && integrations.oidc.targetFilter.stream
      }
      signUpHref={getViewURL("SIGN_UP")}
    />
  );
};

const enhanced = withClearErrorMutation(
  withSignInMutation(
    withLocalStateContainer(
      graphql`
        fragment SignInContainerLocal on Local {
          error
        }
      `
    )(
      withFragmentContainer<Props>({
        auth: graphql`
          fragment SignInContainer_auth on Auth {
            ...SignInWithOIDCContainer_auth
            ...SignInWithGoogleContainer_auth
            ...SignInWithFacebookContainer_auth
            integrations {
              local {
                enabled
                targetFilter {
                  stream
                }
              }
              facebook {
                enabled
                redirectURL
                targetFilter {
                  stream
                }
              }
              google {
                enabled
                redirectURL
                targetFilter {
                  stream
                }
              }
              oidc {
                enabled
                redirectURL
                targetFilter {
                  stream
                }
              }
            }
          }
        `,
      })(SignInContainer)
    )
  )
);

export default enhanced;
