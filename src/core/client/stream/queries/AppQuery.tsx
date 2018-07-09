import * as React from "react";
import { StatelessComponent } from "react";

import {
  graphql,
  QueryRenderer,
  ReadyState,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import {
  AppQueryResponse,
  AppQueryVariables,
} from "talk-stream/__generated__/AppQuery.graphql";
import { AppQueryLocal as Local } from "talk-stream/__generated__/AppQueryLocal.graphql";

import AppContainer from "../containers/AppContainer";

const render = ({ error, props }: ReadyState<AppQueryResponse>) => {
  if (error) {
    return <div>{error.message}</div>;
  }
  if (props) {
    return <AppContainer data={props} />;
  }
  return <div>Loading</div>;
};

interface InnerProps {
  local: Local;
}

const AppQuery: StatelessComponent<InnerProps> = props => {
  return (
    <QueryRenderer<AppQueryVariables, AppQueryResponse>
      query={graphql`
        query AppQuery(
          $assetID: ID!
          $commentID: ID
          $showAssetList: Boolean!
          $showPermalink: Boolean!
        ) {
          ...AppContainer
            @arguments(
              assetID: $assetID
              commentID: $commentID
              showAssetList: $showAssetList
              showPermalink: $showPermalink
            )
        }
      `}
      variables={{
        // We cast `null` to any due to restrictions of the current graphql syntax.
        assetID: props.local.assetID || (null as any),
        // TODO: This is set to false, as server does not support querying assets yet.
        showAssetList: !props.local.assetID && false,

        commentID: props.local.commentID || (null as any),
        showPermalink: false,
      }}
      render={render}
    />
  );
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment AppQueryLocal on Local {
      assetID
      commentID
    }
  `
)(AppQuery);

export default enhanced;
