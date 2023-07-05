import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer, useLocal } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { AppQuery as QueryTypes } from "coral-auth/__generated__/AppQuery.graphql";
import { AppQueryLocal } from "coral-auth/__generated__/AppQueryLocal.graphql";

import AppContainer from "./AppContainer";

const AppQuery: FunctionComponent = () => {
  const [{ view }] = useLocal<AppQueryLocal>(graphql`
    fragment AppQueryLocal on Local {
      view
    }
  `);
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
          <AppContainer
            auth={props.settings.auth}
            viewer={props.viewer}
            view={view}
          />
        );
      }}
    />
  );
};

export default AppQuery;
