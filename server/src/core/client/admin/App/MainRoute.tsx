import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";

import { MainRouteQueryResponse } from "coral-admin/__generated__/MainRouteQuery.graphql";

import ErrorReporterSetUserContainer from "./ErrorReporterSetUserContainer";
import Main from "./Main";

interface Props {
  data: MainRouteQueryResponse | null;
  children?: React.ReactNode;
}

const MainRoute: React.FunctionComponent<Props> = (props) => {
  const ErrorReporterSetUser = props.data ? (
    <ErrorReporterSetUserContainer viewer={props.data.viewer} />
  ) : null;
  return (
    <>
      {ErrorReporterSetUser}
      <Main viewer={props.data && props.data.viewer}>{props.children}</Main>
    </>
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query MainRouteQuery {
      viewer {
        ...ErrorReporterSetUserContainer_viewer
        ...UserMenuContainer_viewer
        ...NavigationContainer_viewer
      }
    }
  `,
})(MainRoute);

export default enhanced;
