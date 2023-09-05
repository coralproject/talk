import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import Main from "coral-auth/components/Main";
import OrSeparator from "coral-auth/components/OrSeparator";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { HorizontalGutter } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import SignInWithEmailContainer from "./SignInWithEmailContainer";
import SignInWithFacebookContainer from "./SignInWithFacebookContainer";
import SignInWithGoogleContainer from "./SignInWithGoogleContainer";
import SignInWithOIDCContainer from "./SignInWithOIDCContainer";

import styles from "./SignIn.css";

export interface SignInForm {
  error: string | null;
  onGotoSignUp: React.EventHandler<React.MouseEvent>;
  signUpHref: string;
  emailEnabled?: boolean;
  facebookEnabled?: boolean;
  googleEnabled?: boolean;
  oidcEnabled?: boolean;
  auth: PropTypesOf<typeof SignInWithOIDCContainer>["auth"] &
    PropTypesOf<typeof SignInWithFacebookContainer>["auth"] &
    PropTypesOf<typeof SignInWithGoogleContainer>["auth"];
}

const SignIn: FunctionComponent<SignInForm> = ({
  onGotoSignUp,
  emailEnabled,
  facebookEnabled,
  googleEnabled,
  oidcEnabled,
  signUpHref,
  auth,
  error,
}) => {
  const ref = useResizePopup();
  const oneClickIntegrationEnabled =
    facebookEnabled || googleEnabled || oidcEnabled;
  return (
    <div ref={ref} data-testid="signIn-container">
      <div role="banner">
        <Localized
          id="signIn-signInToJoinHeader"
          elems={{
            title: <div className={cn(CLASSES.login.title, styles.title)} />,
            subtitle: (
              <div className={cn(CLASSES.login.header, styles.header)} />
            ),
          }}
        >
          <div className={cn(CLASSES.login.bar, styles.bar)}>
            <div className={cn(CLASSES.login.title, styles.title)}>Sign In</div>
            <div className={cn(CLASSES.login.header, styles.header)}>
              to join the conversation
            </div>
          </div>
        </Localized>
      </div>
      {emailEnabled && (
        <div
          role="contentinfo"
          className={cn(CLASSES.login.subBar, styles.subBar)}
        >
          <Localized
            id="signIn-noAccountSignUp"
            elems={{
              textlink: (
                <Button
                  color="primary"
                  variant="flat"
                  paddingSize="none"
                  fontSize="small"
                  fontFamily="secondary"
                  fontWeight="semiBold"
                  underline
                  onClick={onGotoSignUp}
                  href={signUpHref}
                  className={styles.signUp}
                />
              ),
            }}
          >
            <div
              className={cn(CLASSES.login.signIn.noAccount, styles.noAccount)}
            >
              Don't have an account?
              <Button
                color="primary"
                variant="flat"
                paddingSize="none"
                fontSize="small"
                fontFamily="secondary"
                fontWeight="bold"
                underline
                onClick={onGotoSignUp}
                href={signUpHref}
                className={styles.signUp}
              >
                Sign Up
              </Button>
            </div>
          </Localized>
        </div>
      )}
      <Main data-testid="signIn-main">
        {error && (
          <div className={CLASSES.login.errorContainer}>
            <CallOut
              className={CLASSES.login.error}
              color="error"
              title={error}
            />
          </div>
        )}
        {emailEnabled && <SignInWithEmailContainer />}
        {emailEnabled && oneClickIntegrationEnabled && <OrSeparator />}
        <HorizontalGutter>
          {facebookEnabled && <SignInWithFacebookContainer auth={auth} />}
          {googleEnabled && <SignInWithGoogleContainer auth={auth} />}
          {oidcEnabled && <SignInWithOIDCContainer auth={auth} />}
        </HorizontalGutter>
      </Main>
    </div>
  );
};

export default SignIn;
