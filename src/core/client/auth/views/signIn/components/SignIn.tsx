import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Bar, SubBar, Subtitle, Title } from "talk-auth/components//Header";
import Main from "talk-auth/components/Main";
import OrSeparator from "talk-auth/components/OrSeparator";
import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";
import { PropTypesOf } from "talk-framework/types";
import {
  CallOut,
  Flex,
  HorizontalGutter,
  TextLink,
  Typography,
} from "talk-ui/components";

import SignInWithEmailContainer from "../containers/SignInWithEmailContainer";
import SignInWithFacebookContainer from "../containers/SignInWithFacebookContainer";
import SignInWithGoogleContainer from "../containers/SignInWithGoogleContainer";
import SignInWithOIDCContainer from "../containers/SignInWithOIDCContainer";

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
  const oneClickIntegrationEnabled =
    facebookEnabled || googleEnabled || oidcEnabled;
  return (
    <div data-testid="signIn-container">
      <AutoHeightContainer />
      <Localized
        id="signIn-signInToJoinHeader"
        title={<Title />}
        subtitle={<Subtitle />}
      >
        <Bar>
          {
            "<title>Sign In</title><subtitle>to join the conversation</subtitle>"
          }
        </Bar>
      </Localized>
      <SubBar>
        <Localized
          id="signIn-noAccountSignUp"
          textlink={<TextLink onClick={onGotoSignUp} href={signUpHref} />}
        >
          <Typography variant="bodyCopy" container={Flex}>
            {"Don't have an account? <textlink>Sign Up</textlink>"}
          </Typography>
        </Localized>
      </SubBar>
      <Main data-testid="signIn-main">
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
      </Main>
    </div>
  );
};

export default SignIn;
