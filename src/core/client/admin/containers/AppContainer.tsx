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
      <App me={this.props.data && this.props.data.me}>
        {this.props.children}
      </App>
    );
  }
}

const enhanced = withRouteConfig({
  query: graphql`
    query AppContainerQuery {
      me {
        ...UserMenuContainer_me
      }
    }
  `,
})(AppContainer);

export default enhanced;
