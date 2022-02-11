import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useLocal } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";

import { LoginRouteLocal } from "coral-admin/__generated__/LoginRouteLocal.graphql";
import { LoginRouteQueryResponse } from "coral-admin/__generated__/LoginRouteQuery.graphql";

import AccountCompletionContainer from "./AccountCompletionContainer";
import Login from "./Login";

interface Props {
  data: LoginRouteQueryResponse;
}

const LoginRoute: FunctionComponent<Props> = ({ data }) => {
  const [{ authView }] = useLocal<LoginRouteLocal>(graphql`
    fragment LoginRouteLocal on Local {
      authView
    }
  `);
  if (!data) {
    return null;
  }

  return (
    <AccountCompletionContainer auth={data.settings.auth} viewer={data.viewer}>
      <Login auth={data.settings.auth} view={authView!} viewer={data.viewer} />
    </AccountCompletionContainer>
  );
};

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
})(LoginRoute);

export default enhanced;
