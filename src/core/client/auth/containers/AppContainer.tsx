import * as React from "react";
import { StatelessComponent } from "react";

import { AppContainer_auth as AuthData } from "talk-auth/__generated__/AppContainer_auth.graphql";
import { AppContainer_me as UserData } from "talk-auth/__generated__/AppContainer_me.graphql";
import { AppContainerLocal as Local } from "talk-auth/__generated__/AppContainerLocal.graphql";
import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";

import App from "../components/App";

interface InnerProps {
  local: Local;
  auth: AuthData;
  me: UserData | null;
}

const AppContainer: StatelessComponent<InnerProps> = ({
  local: { view },
  auth,
  me,
}) => {
  if (me && !me.username) {
    view = "CREATE_USERNAME";
  }
  return <App view={view} auth={auth} />;
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment AppContainerLocal on Local {
      view
    }
  `
)(
  withFragmentContainer<InnerProps>({
    auth: graphql`
      fragment AppContainer_auth on Auth {
        ...SignInContainer_auth
        ...SignUpContainer_auth
      }
    `,
    me: graphql`
      fragment AppContainer_me on User {
        username
      }
    `,
  })(AppContainer)
);

export default enhanced;
