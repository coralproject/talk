import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import Main from "coral-auth/components/Main";
import OrSeparator from "coral-auth/components/OrSeparator";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import SignUpWithEmailContainer from "./SignUpWithEmailContainer";
import SignUpWithFacebookContainer from "./SignUpWithFacebookContainer";
import SignUpWithGoogleContainer from "./SignUpWithGoogleContainer";
import SignUpWithOIDCContainer from "./SignUpWithOIDCContainer";

import styles from "./SignUp.css";

interface Props {
  onGotoSignIn: React.EventHandler<React.MouseEvent>;
  signInHref: string;
  emailEnabled?: boolean;
  facebookEnabled?: boolean;
  googleEnabled?: boolean;
  oidcEnabled?: boolean;
  auth: PropTypesOf<typeof SignUpWithOIDCContainer>["auth"] &
    PropTypesOf<typeof SignUpWithFacebookContainer>["auth"] &
    PropTypesOf<typeof SignUpWithGoogleContainer>["auth"];
}

const SignUp: FunctionComponent<Props> = ({
  onGotoSignIn,
  emailEnabled,
  facebookEnabled,
  googleEnabled,
  oidcEnabled,
  signInHref,
  auth,
}) => {
  const ref = useResizePopup();
  const oneClickUptegrationEnabled =
    facebookEnabled || googleEnabled || oidcEnabled;
  return (
    <div ref={ref} data-testid="signUp-container">
      <div role="banner">
        <Localized
          id="signUp-signUpToJoinHeader"
          title={<div className={cn(CLASSES.login.title, styles.title)} />}
          subtitle={<div className={cn(CLASSES.login.header, styles.header)} />}
        >
          <div className={cn(CLASSES.login.bar, styles.bar)}>
            <div className={cn(CLASSES.login.title, styles.title)}>Sign Up</div>
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
            id="signUp-accountAvailableSignIn"
            textlink={
              <Button
                color="primary"
                variant="flat"
                marginSize="none"
                textSize="small"
                fontFamily="secondary"
                fontWeight="semiBold"
                underline
                onClick={onGotoSignIn}
                href={signInHref}
                className={styles.signIn}
              />
            }
          >
            <div
              className={cn(
                CLASSES.login.signUp.alreadyHaveAccount,
                styles.alreadyHaveAccount
              )}
            >
              Already have an account?{" "}
              <Button
                color="primary"
                variant="flat"
                marginSize="none"
                textSize="small"
                fontFamily="secondary"
                fontWeight="bold"
                underline
                onClick={onGotoSignIn}
                href={signInHref}
                className={styles.signIn}
              >
                Sign In
              </Button>
            </div>
          </Localized>
        </div>
      )}
      <Main data-testid="signUp-main">
        {emailEnabled && <SignUpWithEmailContainer />}
        {emailEnabled && oneClickUptegrationEnabled && <OrSeparator />}
        <HorizontalGutter>
          {facebookEnabled && <SignUpWithFacebookContainer auth={auth} />}
          {googleEnabled && <SignUpWithGoogleContainer auth={auth} />}
          {oidcEnabled && <SignUpWithOIDCContainer auth={auth} />}
        </HorizontalGutter>
      </Main>
    </div>
  );
};

export default SignUp;
