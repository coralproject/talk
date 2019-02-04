import { RouteProps } from "found";
import React, { Component } from "react";

import { LoginContainerLocal as LocalData } from "talk-admin/__generated__/LoginContainerLocal.graphql";
import { LoginContainerQueryResponse } from "talk-admin/__generated__/LoginContainerQuery.graphql";
import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";
import { withRouteConfig } from "talk-framework/lib/router";

import Login from "../components/Login";
import AccountCompletionContainer from "./AccountCompletionContainer";

interface Props {
  local: LocalData;
  data: LoginContainerQueryResponse;
  error?: Error | null;
}

class LoginContainer extends Component<Props> {
  public static routeConfig: RouteProps;

  public render() {
    if (!this.props.data) {
      return null;
    }

    return (
      <AccountCompletionContainer
        auth={this.props.data.settings.auth}
        me={this.props.data.me}
      >
        <Login
          auth={this.props.data.settings.auth}
          view={this.props.local.authView!}
        />
      </AccountCompletionContainer>
    );
  }
}

const enhanced = withRouteConfig<LoginContainerQueryResponse>({
  query: graphql`
    query LoginContainerQuery {
      me {
        ...AccountCompletionContainer_me
      }
      settings {
        auth {
          ...AccountCompletionContainer_auth
          ...SignInContainer_auth
        }
      }
    }
  `,
})(
  withLocalStateContainer(
    graphql`
      fragment LoginContainerLocal on Local {
        authView
      }
    `
  )(LoginContainer)
);
export default enhanced;
