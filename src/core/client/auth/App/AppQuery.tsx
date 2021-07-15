import React, { Component } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

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
            return <QueryError error={error} />;
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
