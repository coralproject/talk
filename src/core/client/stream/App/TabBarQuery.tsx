import React, { Component } from "react";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";

import { TabBarQuery as QueryTypes } from "coral-stream/__generated__/TabBarQuery.graphql";
import { TabBarQueryLocal as Local } from "coral-stream/__generated__/TabBarQueryLocal.graphql";

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
            }
            story(id: $storyID, url: $storyURL) {
              ...TabBarContainer_story
            }
          }
        `}
        variables={{
          storyID,
          storyURL,
        }}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }

          return (
            <TabBarContainer
              story={(props && props.story) || null}
              viewer={(props && props.viewer) || null}
            />
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
