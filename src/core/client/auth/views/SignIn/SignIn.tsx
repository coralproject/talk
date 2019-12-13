import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Bar, SubBar, Subtitle, Title } from "coral-auth/components/Header";
import Main from "coral-auth/components/Main";
import OrSeparator from "coral-auth/components/OrSeparator";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { PropTypesOf } from "coral-framework/types";
import {
  CallOut,
  Flex,
  HorizontalGutter,
  TextLink,
  Typography,
} from "coral-ui/components";

import SignInWithEmailContainer from "./SignInWithEmailContainer";
import SignInWithFacebookContainer from "./SignInWithFacebookContainer";
import SignInWithGoogleContainer from "./SignInWithGoogleContainer";
import SignInWithOIDCContainer from "./SignInWithOIDCContainer";

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
      <Localized
        id="signIn-signInToJoinHeader"
        title={<Title />}
        subtitle={<Subtitle />}
      >
        <Bar>
          <Title>Sign In</Title>
          <Subtitle>to join the conversation</Subtitle>
        </Bar>
      </Localized>
      {emailEnabled && (
        <SubBar>
          <Localized
            id="signIn-noAccountSignUp"
            textlink={<TextLink onClick={onGotoSignUp} href={signUpHref} />}
          >
            <Typography variant="bodyCopy" container={Flex}>
              Don't have an account?{" "}
              <TextLink onClick={onGotoSignUp} href={signUpHref}>
                Sign Up
              </TextLink>
            </Typography>
          </Localized>
        </SubBar>
      )}
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
