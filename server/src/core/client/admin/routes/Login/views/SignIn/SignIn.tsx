import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import AuthBox from "coral-admin/components/AuthBox";
import { PropTypesOf } from "coral-framework/types";
import { CallOut, HorizontalGutter } from "coral-ui/components/v2";

import OrSeparator from "./OrSeparator";
import SignInWithEmailContainer from "./SignInWithEmailContainer";
import SignInWithFacebookContainer from "./SignInWithFacebookContainer";
import SignInWithGoogleContainer from "./SignInWithGoogleContainer";
import SignInWithOIDCContainer from "./SignInWithOIDCContainer";
import Version from "./Version";

import styles from "./SignIn.css";

interface Props {
  error: string | null;
  emailEnabled?: boolean;
  facebookEnabled?: boolean;
  googleEnabled?: boolean;
  oidcEnabled?: boolean;
  auth: PropTypesOf<typeof SignInWithOIDCContainer>["auth"] &
    PropTypesOf<typeof SignInWithFacebookContainer>["auth"] &
    PropTypesOf<typeof SignInWithGoogleContainer>["auth"];
}

const SignIn: FunctionComponent<Props> = ({
  emailEnabled,
  facebookEnabled,
  googleEnabled,
  oidcEnabled,
  auth,
  error,
}) => {
  const oneClickIntegrationEnabled =
    facebookEnabled || googleEnabled || oidcEnabled;
  return (
    <>
      <AuthBox
        title={
          <div className={styles.title}>
            <Localized id="login-signInTo">
              <span>Sign in to</span>
            </Localized>
          </div>
        }
      >
        <HorizontalGutter size="oneAndAHalf">
          {error && (
            <CallOut color="error" fullWidth>
              {error}
            </CallOut>
          )}
          {emailEnabled && <SignInWithEmailContainer />}
          {emailEnabled && oneClickIntegrationEnabled && (
            <div className={styles.orSeparator}>
              <OrSeparator />
            </div>
          )}
          {oneClickIntegrationEnabled && (
            <HorizontalGutter>
              {facebookEnabled && (
                <div className={styles.loginButton}>
                  <SignInWithFacebookContainer auth={auth} />
                </div>
              )}
              {googleEnabled && (
                <div className={styles.loginButton}>
                  <SignInWithGoogleContainer auth={auth} />
                </div>
              )}
              {oidcEnabled && <SignInWithOIDCContainer auth={auth} />}
            </HorizontalGutter>
          )}
        </HorizontalGutter>
      </AuthBox>
      <Version />
    </>
  );
};

export default SignIn;
