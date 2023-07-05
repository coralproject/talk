import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { graphql } from "react-relay";

import { getViewURL } from "coral-auth/helpers";
import { SetViewMutation } from "coral-auth/mutations";
import { redirectOAuth2 } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";

import { SignInContainer_auth } from "coral-auth/__generated__/SignInContainer_auth.graphql";
import { SignInContainerLocal } from "coral-auth/__generated__/SignInContainerLocal.graphql";

import {
  ClearErrorMutation,
  withClearErrorMutation,
} from "./ClearErrorMutation";
import SignIn from "./SignIn";

interface Props {
  auth: SignInContainer_auth;
  clearError: ClearErrorMutation;
}

function isEnabled(integration: {
  enabled: boolean;
  targetFilter: { stream: boolean };
}) {
  return integration.enabled && integration.targetFilter.stream;
}

const SignInContainer: FunctionComponent<Props> = ({ auth, clearError }) => {
  const setView = useMutation(SetViewMutation);
  const { window } = useCoralContext();

  const [{ error }] = useLocal<SignInContainerLocal>(graphql`
    fragment SignInContainerLocal on Local {
      error
    }
  `);

  const goToSignUp = useCallback(
    (e: React.MouseEvent) => {
      setView({ view: "SIGN_UP", history: "push" });

      if (e.preventDefault) {
        e.preventDefault();
      }
    },
    [setView]
  );

  const {
    integrations: { local, facebook, google, oidc },
  } = auth;

  useEffect(() => {
    return () => {
      // Clear the error when we unmount.
      void clearError();
    };
  }, [clearError, auth]);

  // Compute the redirectURL if supported.
  const redirectURL = useMemo(() => {
    // If there was an error, then we can't redirect the viewer.
    if (error) {
      return;
    }

    // If the local integration is enabled, then we can't redirect the viewer.
    if (isEnabled(local)) {
      return;
    }

    const enabled = [facebook, google, oidc].filter((i) => isEnabled(i));

    // If there is more than one integration enabled, or there is no
    // integrations enabled, then we can't redirect the viewer.
    if (enabled.length > 1 || enabled.length === 0) {
      return;
    }

    const integration = enabled[0];

    // If there is no url to redirect to, we can't redirect the viewer.
    if (!integration.redirectURL) {
      return;
    }

    return integration.redirectURL;
  }, [error, facebook, google, local, oidc]);

  useEffect(() => {
    // If there's no url to redirect to, then we can't redirect the viewer.
    if (!redirectURL) {
      return;
    }

    redirectOAuth2(window, redirectURL);
  }, [redirectURL, window]);

  // If we are redirecting, then render nothing.
  if (redirectURL) {
    return null;
  }

  return (
    <SignIn
      error={error}
      auth={auth}
      onGotoSignUp={goToSignUp}
      emailEnabled={isEnabled(local)}
      facebookEnabled={isEnabled(facebook)}
      googleEnabled={isEnabled(google)}
      oidcEnabled={isEnabled(oidc)}
      signUpHref={getViewURL("SIGN_UP", window)}
    />
  );
};

const enhanced = withClearErrorMutation(
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
);

export default enhanced;
