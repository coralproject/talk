import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";

import { MainRouteQueryResponse } from "coral-admin/__generated__/MainRouteQuery.graphql";

import Main from "./Main";

interface Props {
  data: MainRouteQueryResponse | null;
}

class MainRoute extends React.Component<Props> {
  public render() {
    return (
      <Main viewer={this.props.data && this.props.data.viewer}>
        {this.props.children}
      </Main>
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query MainRouteQuery {
      viewer {
        ...UserMenuContainer_viewer
        ...NavigationContainer_viewer
      }
    }
  `,
})(MainRoute);

export default enhanced;
