import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Bar, SubBar, Subtitle, Title } from "talk-auth/components//Header";
import Main from "talk-auth/components/Main";
import OrSeparator from "talk-auth/components/OrSeparator";
import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";
import { PropTypesOf } from "talk-framework/types";
import { Button, Flex, HorizontalGutter, Typography } from "talk-ui/components";

import SignUpWithEmailContainer from "../containers/SignUpWithEmailContainer";
import SignUpWithFacebookContainer from "../containers/SignUpWithFacebookContainer";
import SignUpWithGoogleContainer from "../containers/SignUpWithGoogleContainer";
import SignUpWithOIDCContainer from "../containers/SignUpWithOIDCContainer";

interface Props {
  onGotoSignIn: () => void;
  emailEnabled?: boolean;
  facebookEnabled?: boolean;
  googleEnabled?: boolean;
  oidcEnabled?: boolean;
  auth: PropTypesOf<typeof SignUpWithOIDCContainer>["auth"] &
    PropTypesOf<typeof SignUpWithFacebookContainer>["auth"] &
    PropTypesOf<typeof SignUpWithGoogleContainer>["auth"];
}

const SignUp: StatelessComponent<Props> = ({
  onGotoSignIn,
  emailEnabled,
  facebookEnabled,
  googleEnabled,
  oidcEnabled,
  auth,
}) => {
  const oneClickUptegrationEnabled =
    facebookEnabled || googleEnabled || oidcEnabled;
  return (
    <div data-testid="signUp-container">
      <AutoHeightContainer />
      <Localized
        id="signUp-signUpToJoinHeader"
        title={<Title />}
        subtitle={<Subtitle />}
      >
        <Bar>
          {
            "<title>Sign Up</title><subtitle>to join the conversation</subtitle>"
          }
        </Bar>
      </Localized>
      <SubBar>
        <Localized
          id="signUp-accountAvailableSignIn"
          button={
            <Button
              data-testid="gotoSignInButton"
              variant="underlined"
              size="small"
              color="primary"
              onClick={onGotoSignIn}
            />
          }
        >
          <Typography variant="bodyCopy" container={Flex}>
            {"Already have an account? <button>Sign In</button>"}
          </Typography>
        </Localized>
      </SubBar>
      <Main data-testid="signUp-main">
        <HorizontalGutter size="oneAndAHalf">
          {emailEnabled && <SignUpWithEmailContainer />}
          {emailEnabled && oneClickUptegrationEnabled && <OrSeparator />}
          <HorizontalGutter>
            {facebookEnabled && <SignUpWithFacebookContainer auth={auth} />}
            {googleEnabled && <SignUpWithGoogleContainer auth={auth} />}
            {oidcEnabled && <SignUpWithOIDCContainer auth={auth} />}
          </HorizontalGutter>
        </HorizontalGutter>
      </Main>
    </div>
  );
};

export default SignUp;
