import { RouteProps } from "found";
import React, { Component } from "react";
import { graphql } from "react-relay";

import { withLocalStateContainer } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";

import { LoginRouteLocal$data as LocalData } from "coral-admin/__generated__/LoginRouteLocal.graphql";
import { LoginRouteQueryResponse } from "coral-admin/__generated__/LoginRouteQuery.graphql";

import AccountCompletionContainer from "./AccountCompletionContainer";
import Login from "./Login";

interface Props {
  local: LocalData;
  data: LoginRouteQueryResponse;
  error?: Error | null;
}

class LoginRoute extends Component<Props> {
  public static routeConfig: RouteProps;

  public render() {
    if (!this.props.data) {
      return null;
    }

    return (
      <AccountCompletionContainer
        auth={this.props.data.settings.auth}
        viewer={this.props.data.viewer}
      >
        <Login
          auth={this.props.data.settings.auth}
          view={this.props.local.authView!}
          viewer={this.props.data.viewer}
        />
      </AccountCompletionContainer>
    );
  }
}

const enhanced = withRouteConfig<LoginRouteQueryResponse>({
  query: graphql`
    query LoginRouteQuery {
      viewer {
        ...AccountCompletionContainer_viewer
        ...LinkAccountContainer_viewer
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
      fragment LoginRouteLocal on Local {
        authView
      }
    `
  )(LoginRoute)
);

export default enhanced;
