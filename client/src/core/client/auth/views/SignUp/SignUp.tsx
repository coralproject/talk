import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import Main from "coral-auth/components/Main";
import OrSeparator from "coral-auth/components/OrSeparator";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { HorizontalGutter } from "coral-ui/components/v2";

import SignInWithLocalHeader from "./SignInWithLocalHeader";
import SignUpWithBskyContainer from "./SignUpWithBskyContainer";
import SignUpWithEmailContainer from "./SignUpWithEmailContainer";
import SignUpWithFacebookContainer from "./SignUpWithFacebookContainer";
import SignUpWithGoogleContainer from "./SignUpWithGoogleContainer";
import SignUpWithOIDCContainer from "./SignUpWithOIDCContainer";

import styles from "./SignUp.css";

interface Props {
  onSignIn: () => void;
  localEnabled?: boolean;
  bskyEnabled?: boolean;
  facebookEnabled?: boolean;
  googleEnabled?: boolean;
  oidcEnabled?: boolean;
  auth: PropTypesOf<typeof SignUpWithOIDCContainer>["auth"] &
    PropTypesOf<typeof SignUpWithFacebookContainer>["auth"] &
    PropTypesOf<typeof SignUpWithGoogleContainer>["auth"] &
    PropTypesOf<typeof SignUpWithBskyContainer>["auth"];
}

const SignUp: FunctionComponent<Props> = ({
  onSignIn,
  localEnabled,
  bskyEnabled,
  facebookEnabled,
  googleEnabled,
  oidcEnabled,
  auth,
}) => {
  const ref = useResizePopup();

  const oneClickIntegrationEnabled =
    bskyEnabled || facebookEnabled || googleEnabled || oidcEnabled;

  return (
    <div ref={ref} data-testid="signUp-container">
      <div role="banner">
        <Localized
          id="signUp-signUpToJoinHeader"
          elems={{
            title: <div className={cn(CLASSES.login.title, styles.title)} />,
            subtitle: (
              <div className={cn(CLASSES.login.header, styles.header)} />
            ),
          }}
        >
          <div className={cn(CLASSES.login.bar, styles.bar)}>
            <div className={cn(CLASSES.login.title, styles.title)}>Sign Up</div>
            <div className={cn(CLASSES.login.header, styles.header)}>
              to join the conversation
            </div>
          </div>
        </Localized>
      </div>
      {localEnabled && <SignInWithLocalHeader onSignIn={onSignIn} />}
      <Main data-testid="signUp-main">
        {localEnabled && <SignUpWithEmailContainer />}
        {localEnabled && oneClickIntegrationEnabled && <OrSeparator />}
        <HorizontalGutter>
          {bskyEnabled && <SignUpWithBskyContainer auth={auth} />}
          {facebookEnabled && <SignUpWithFacebookContainer auth={auth} />}
          {googleEnabled && <SignUpWithGoogleContainer auth={auth} />}
          {oidcEnabled && <SignUpWithOIDCContainer auth={auth} />}
        </HorizontalGutter>
      </Main>
    </div>
  );
};

export default SignUp;
