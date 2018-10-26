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
    const { assetID, assetURL } = this.props.local;
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query TabBarQuery($assetID: ID, $assetURL: String) {
            asset(id: $assetID, url: $assetURL) {
              ...TabBarContainer_asset
            }
          }
        `}
        variables={{
          assetID,
          assetURL,
        }}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }

          return <TabBarContainer asset={(props && props.asset) || null} />;
        }}
      />
    );
  }
}

const enhanced = withLocalStateContainer(
  graphql`
    fragment TabBarQueryLocal on Local {
      assetID
      assetURL
    }
  `
)(TabBarQuery);

export default enhanced;
