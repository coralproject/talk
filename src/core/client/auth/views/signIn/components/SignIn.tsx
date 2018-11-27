import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Bar, SubBar, Subtitle, Title } from "talk-auth/components//Header";
import Main from "talk-auth/components/Main";
import OrSeparator from "talk-auth/components/OrSeparator";
import { PropTypesOf } from "talk-framework/types";
import { Button, Flex, HorizontalGutter, Typography } from "talk-ui/components";

import SignInWithEmailContainer from "../containers/SignInWithEmailContainer";
import SignInWithFacebookContainer from "../containers/SignInWithFacebookContainer";
import SignInWithGoogleContainer from "../containers/SignInWithGoogleContainer";
import SignInWithOIDCContainer from "../containers/SignInWithOIDCContainer";

export interface SignInForm {
  onGotoSignUp: () => void;
  emailEnabled?: boolean;
  facebookEnabled?: boolean;
  googleEnabled?: boolean;
  oidcEnabled?: boolean;
  auth: PropTypesOf<typeof SignInWithOIDCContainer>["auth"] &
    PropTypesOf<typeof SignInWithFacebookContainer>["auth"] &
    PropTypesOf<typeof SignInWithGoogleContainer>["auth"];
}

const SignIn: StatelessComponent<SignInForm> = ({
  onGotoSignUp,
  emailEnabled,
  facebookEnabled,
  googleEnabled,
  oidcEnabled,
  auth,
}) => {
  const oneClickIntegrationEnabled =
    facebookEnabled || googleEnabled || oidcEnabled;
  return (
    <div>
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
          button={
            <Button
              id="signIn-gotoSignUpButton"
              variant="underlined"
              size="small"
              color="primary"
              onClick={onGotoSignUp}
            />
          }
        >
          <Typography variant="bodyCopy" container={Flex}>
            {"Don't have an account? <button>Sign Up</button>"}
          </Typography>
        </Localized>
      </SubBar>
      <Main>
        <HorizontalGutter size="oneAndAHalf">
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
