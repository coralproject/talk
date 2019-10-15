import React, { Component } from "react";

import { graphql, QueryRenderer } from "coral-framework/lib/relay";

import { AppQuery as QueryTypes } from "coral-auth/__generated__/AppQuery.graphql";

import AppContainer from "./AppContainer";

export default class AppQuery extends Component {
  public render() {
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query AppQuery {
            viewer {
              ...AppContainer_viewer
            }
            settings {
              auth {
                ...AppContainer_auth
              }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }
          if (!props) {
            return null;
          }
          return (
            <AppContainer auth={props.settings.auth} viewer={props.viewer} />
          );
        }}
      />
    );
  }
}
