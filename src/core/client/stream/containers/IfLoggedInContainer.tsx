import React, { Component } from "react";

import { graphql, QueryRenderer } from "talk-framework/lib/relay";
import { IfLoggedInContainerQuery as QueryTypes } from "talk-stream/__generated__/IfLoggedInContainerQuery.graphql";

class IfLoggedInContainer extends Component {
  public render() {
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query IfLoggedInContainerQuery {
            me {
              id
            }
          }
        `}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }

          if (props && props.me) {
            return <>{this.props.children}</>;
          }

          return null;
        }}
        variables={{}}
      />
    );
  }
}

export default IfLoggedInContainer;
