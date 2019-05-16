import React from "react";

import { AppContainerQueryResponse } from "coral-admin/__generated__/AppContainerQuery.graphql";

import { graphql } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";

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

const enhanced = withRouteConfig<Props>({
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
