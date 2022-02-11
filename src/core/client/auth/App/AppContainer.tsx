import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";

import { AppContainer_auth as AuthData } from "coral-auth/__generated__/AppContainer_auth.graphql";
import { AppContainer_viewer as UserData } from "coral-auth/__generated__/AppContainer_viewer.graphql";
import { AppContainerLocal } from "coral-auth/__generated__/AppContainerLocal.graphql";

import AccountCompletionContainer from "./AccountCompletion";
import App from "./App";

interface Props {
  auth: AuthData;
  viewer: UserData | null;
}

const AppContainer: FunctionComponent<Props> = ({ auth, viewer }) => {
  const [{ view }] = useLocal<AppContainerLocal>(graphql`
    fragment AppContainerLocal on Local {
      view
    }
  `);
  // If we're dealing with a password reset, we can't possibly worry about
  // account completion (because they are not logged in, or have already
  // completed their account), so disregard here, and just return the App.
  if (view === "FORGOT_PASSWORD") {
    return <App view={view} auth={auth} viewer={viewer} />;
  }

  return (
    <AccountCompletionContainer auth={auth} viewer={viewer}>
      <App view={view} auth={auth} viewer={viewer} />
    </AccountCompletionContainer>
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment AppContainer_auth on Auth {
      ...SignInContainer_auth
      ...SignUpContainer_auth
      ...AccountCompletionContainer_auth
    }
  `,
  viewer: graphql`
    fragment AppContainer_viewer on User {
      ...AccountCompletionContainer_viewer
      ...ForgotPasswordContainer_viewer
      ...LinkAccountContainer_viewer
    }
  `,
})(AppContainer);

export default enhanced;
