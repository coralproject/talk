import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { SetViewMutation } from "coral-auth/mutations";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";

import { SignUpContainer_auth as AuthData } from "coral-auth/__generated__/SignUpContainer_auth.graphql";

import SignUp from "./SignUp";

interface Props {
  auth: AuthData;
}

function isEnabled(integration: {
  enabled: boolean;
  targetFilter: { stream: boolean };
  allowRegistration: boolean;
}) {
  return (
    integration.enabled &&
    integration.targetFilter.stream &&
    integration.allowRegistration
  );
}

const SignUpContainer: FunctionComponent<Props> = ({ auth }) => {
  const setView = useMutation(SetViewMutation);

  const onSignIn = useCallback(() => {
    setView({ view: "SIGN_IN", history: "push" });
  }, [setView]);

  const {
    integrations: { local, facebook, google, oidc },
  } = auth;

  return (
    <SignUp
      auth={auth}
      onSignIn={onSignIn}
      localEnabled={isEnabled(local)}
      facebookEnabled={isEnabled(facebook)}
      googleEnabled={isEnabled(google)}
      oidcEnabled={isEnabled(oidc)}
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
