import React from "react";

import { AppContainerQueryResponse } from "talk-admin/__generated__/AppContainerQuery.graphql";

import { graphql } from "talk-framework/lib/relay";
import { withRouteConfig } from "talk-framework/lib/router";

import App from "../components/App";

interface Props {
  data: AppContainerQueryResponse | null;
}

class AppContainer extends React.Component<Props> {
  public render() {
    return (
      <App viewer={this.props.data && this.props.data.viewer}>
        {this.props.children}
      </App>
    );
  }
}

const enhanced = withRouteConfig({
  query: graphql`
    query AppContainerQuery {
      viewer {
        ...UserMenuContainer_viewer
        ...NavigationContainer_viewer
      }
    }
  `,
})(AppContainer);

export default enhanced;
