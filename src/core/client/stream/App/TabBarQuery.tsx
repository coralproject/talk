import React, { Component } from "react";
import { graphql } from "react-relay";

import {
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { TabBarQuery as QueryTypes } from "coral-stream/__generated__/TabBarQuery.graphql";
import { TabBarQueryLocal as Local } from "coral-stream/__generated__/TabBarQueryLocal.graphql";

import ErrorReporterSetUserContainer from "./ErrorReporterSetUserContainer";
import TabBarContainer from "./TabBarContainer";

interface Props {
  local: Local;
}

class TabBarQuery extends Component<Props> {
  public render() {
    const { storyID, storyURL } = this.props.local;
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query TabBarQuery($storyID: ID, $storyURL: String) {
            viewer {
              ...TabBarContainer_viewer
              ...ErrorReporterSetUserContainer_viewer
            }
            story(id: $storyID, url: $storyURL) {
              ...TabBarContainer_story
            }
            settings {
              ...TabBarContainer_settings
            }
          }
        `}
        variables={{
          storyID,
          storyURL,
        }}
        render={({ error, props }) => {
          if (error) {
            return <QueryError error={error} />;
          }

          const ErrorReporterSetUser = props ? (
            <ErrorReporterSetUserContainer viewer={props.viewer} />
          ) : null;

          return (
            <>
              {ErrorReporterSetUser}
              <TabBarContainer
                settings={(props && props.settings) || null}
                story={(props && props.story) || null}
                viewer={(props && props.viewer) || null}
              />
            </>
          );
        }}
      />
    );
  }
}

const enhanced = withLocalStateContainer(
  graphql`
    fragment TabBarQueryLocal on Local {
      storyID
      storyURL
    }
  `
)(TabBarQuery);

export default enhanced;
