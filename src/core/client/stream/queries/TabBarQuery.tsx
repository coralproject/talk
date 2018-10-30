import React, { Component } from "react";
import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";

import { TabBarQuery as QueryTypes } from "talk-stream/__generated__/TabBarQuery.graphql";
import { TabBarQueryLocal as Local } from "talk-stream/__generated__/TabBarQueryLocal.graphql";

import TabBarContainer from "../containers/TabBarContainer";

interface InnerProps {
  local: Local;
}

class TabBarQuery extends Component<InnerProps> {
  public render() {
    const { storyID, storyURL } = this.props.local;
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query TabBarQuery($storyID: ID, $storyURL: String) {
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

          return <TabBarContainer story={(props && props.story) || null} />;
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
