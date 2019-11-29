import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Bar, SubBar, Subtitle, Title } from "coral-auth/components//Header";
import Main from "coral-auth/components/Main";
import OrSeparator from "coral-auth/components/OrSeparator";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { PropTypesOf } from "coral-framework/types";
import {
  Flex,
  HorizontalGutter,
  TextLink,
  Typography,
} from "coral-ui/components";

import SignUpWithEmailContainer from "./SignUpWithEmailContainer";
import SignUpWithFacebookContainer from "./SignUpWithFacebookContainer";
import SignUpWithGoogleContainer from "./SignUpWithGoogleContainer";
import SignUpWithOIDCContainer from "./SignUpWithOIDCContainer";

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
      <Localized
        id="signUp-signUpToJoinHeader"
        title={<Title />}
        subtitle={<Subtitle />}
      >
        <Bar>
          <Title>Sign Up</Title>
          <Subtitle>to join the conversation</Subtitle>
        </Bar>
      </Localized>
      {emailEnabled && (
        <SubBar>
          <Localized
            id="signUp-accountAvailableSignIn"
            textlink={<TextLink onClick={onGotoSignIn} href={signInHref} />}
          >
            <Typography variant="bodyCopy" container={Flex}>
              Already have an account?{" "}
              <TextLink onClick={onGotoSignIn} href={signInHref}>
                Sign In
              </TextLink>
            </Typography>
          </Localized>
        </SubBar>
      )}
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
