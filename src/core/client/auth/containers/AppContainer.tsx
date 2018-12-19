import * as React from "react";
import { Component } from "react";

import { AppContainer_auth as AuthData } from "talk-auth/__generated__/AppContainer_auth.graphql";
import { AppContainer_me as UserData } from "talk-auth/__generated__/AppContainer_me.graphql";
import { AppContainerLocal as Local } from "talk-auth/__generated__/AppContainerLocal.graphql";
import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";

import App from "../components/App";
import AccountCompletionContainer from "./AccountCompletionContainer";

interface Props {
  local: Local;
  auth: AuthData;
  me: UserData | null;
}

class AppContainer extends Component<Props> {
  public render() {
    const {
      local: { view },
      auth,
      me,
    } = this.props;
    return (
      <AccountCompletionContainer auth={auth} me={me}>
        <App view={view} auth={auth} />
      </AccountCompletionContainer>
    );
  }
}

const enhanced = withLocalStateContainer(
  graphql`
    fragment AppContainerLocal on Local {
      view
    }
  `
)(
  withFragmentContainer<Props>({
    auth: graphql`
      fragment AppContainer_auth on Auth {
        ...SignInContainer_auth
        ...SignUpContainer_auth
        ...AccountCompletionContainer_auth
      }
    `,
    me: graphql`
      fragment AppContainer_me on User {
        ...AccountCompletionContainer_me
      }
    `,
  })(AppContainer)
);

export default enhanced;
