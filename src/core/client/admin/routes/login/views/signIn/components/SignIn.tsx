import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import {
  BrandIcon,
  BrandName,
  CallOut,
  Flex,
  HorizontalGutter,
  Typography,
} from "talk-ui/components";

import SignInWithEmailContainer from "../containers/SignInWithEmailContainer";
import SignInWithFacebookContainer from "../containers/SignInWithFacebookContainer";
import SignInWithGoogleContainer from "../containers/SignInWithGoogleContainer";
import SignInWithOIDCContainer from "../containers/SignInWithOIDCContainer";
import OrSeparator from "./OrSeparator";

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

const SignIn: StatelessComponent<Props> = ({
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
    <div>
      <Flex justifyContent="center">
        <HorizontalGutter className={styles.loginContainer} size="double">
          <Flex justifyContent="center">
            <div className={styles.brandIcon}>
              <BrandIcon size="lg" />
            </div>
          </Flex>
          <div>
            <Localized id="login-signInTo">
              <Typography align="center" variant="heading3">
                Sign in to
              </Typography>
            </Localized>
            <BrandName size="lg" align="center" />
          </div>
          <HorizontalGutter size="oneAndAHalf">
            {error && (
              <CallOut color="error" fullWidth>
                {error}
              </CallOut>
            )}
            {emailEnabled && <SignInWithEmailContainer />}
            {emailEnabled && oneClickIntegrationEnabled && <OrSeparator />}
            <HorizontalGutter>
              {facebookEnabled && <SignInWithFacebookContainer auth={auth} />}
              {googleEnabled && <SignInWithGoogleContainer auth={auth} />}
              {oidcEnabled && <SignInWithOIDCContainer auth={auth} />}
            </HorizontalGutter>
          </HorizontalGutter>
        </HorizontalGutter>
      </Flex>
    </div>
  );
};

export default SignIn;
