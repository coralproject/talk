import { RouteProps } from "found";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { createRouteConfig } from "coral-framework/lib/router";

import { LoginRouteQueryResponse } from "coral-admin/__generated__/LoginRouteQuery.graphql";

import AccountCompletionContainer from "./AccountCompletionContainer";
import Login from "./Login";

interface Props {
  data: LoginRouteQueryResponse;
}

const LoginRoute: FunctionComponent<Props> & { routeConfig: RouteProps } = ({
  data,
}) => {
  if (!data) {
    return null;
  }

  return (
    <AccountCompletionContainer auth={data.settings.auth} viewer={data.viewer}>
      <Login auth={data.settings.auth} viewer={data.viewer} />
    </AccountCompletionContainer>
  );
};

LoginRoute.routeConfig = createRouteConfig({
  Component: LoginRoute,
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
});

export default LoginRoute;
