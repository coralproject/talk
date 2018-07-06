import * as React from "react";
import { StatelessComponent } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import {
  AppQueryResponse,
  AppQueryVariables,
} from "talk-stream/__generated__/AppQuery.graphql";
import { AppQueryLocal as Local } from "talk-stream/__generated__/AppQueryLocal.graphql";

import AppContainer from "../containers/AppContainer";

export const render = ({ error, props }: ReadyState<AppQueryResponse>) => {
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
        query AppQuery($showAssetList: Boolean!, $assetID: ID!) {
          ...AppContainer
            @arguments(showAssetList: $showAssetList, assetID: $assetID)
        }
      `}
      variables={{
        // We cast `null` to any due to restrictions of the current graphql syntax.
        assetID: props.local.assetID || (null as any),
        // TODO: This is set to false, as server does not support querying assets yet.
        showAssetList: !props.local.assetID && false,
      }}
      render={render}
    />
  );
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment AppQueryLocal on Local {
      assetID
    }
  `
)(AppQuery);

export default enhanced;
