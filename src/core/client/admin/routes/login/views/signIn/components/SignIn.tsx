import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import AuthBox from "talk-admin/components/AuthBox";
import { PropTypesOf } from "talk-framework/types";
import { CallOut, HorizontalGutter } from "talk-ui/components";

import SignInWithEmailContainer from "../containers/SignInWithEmailContainer";
import SignInWithFacebookContainer from "../containers/SignInWithFacebookContainer";
import SignInWithGoogleContainer from "../containers/SignInWithGoogleContainer";
import SignInWithOIDCContainer from "../containers/SignInWithOIDCContainer";
import OrSeparator from "./OrSeparator";
import Version from "./Version";

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
          <Localized id="login-signInTo">
            <span>Sign in to</span>
          </Localized>
        }
      >
        <HorizontalGutter size="oneAndAHalf">
          {error && (
            <CallOut color="error" fullWidth>
              {error}
            </CallOut>
          )}
          {emailEnabled && <SignInWithEmailContainer />}
          {emailEnabled && oneClickIntegrationEnabled && <OrSeparator />}
          {oneClickIntegrationEnabled && (
            <HorizontalGutter>
              {facebookEnabled && <SignInWithFacebookContainer auth={auth} />}
              {googleEnabled && <SignInWithGoogleContainer auth={auth} />}
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
