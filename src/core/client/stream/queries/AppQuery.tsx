import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { ReadyState } from "react-relay";
import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { AppQuery as QueryTypes } from "talk-stream/__generated__/AppQuery.graphql";
import { AppQueryLocal as Local } from "talk-stream/__generated__/AppQueryLocal.graphql";
import { Spinner } from "talk-ui/components";
import AppContainer from "../containers/AppContainer";

interface InnerProps {
  local: Local;
}

export const render = ({
  error,
  props,
}: ReadyState<QueryTypes["response"]>) => {
  if (error) {
    return <div>{error.message}</div>;
  }

  if (props) {
    if (!props.asset) {
      return (
        <Localized id="comments-streamQuery-assetNotFound">
          <div>Asset not found</div>
        </Localized>
      );
    }

    return (
      <AppContainer commentCount={props.asset.commentCounts.totalVisible} />
    );
  }

  return <Spinner />;
};

const AppQuery: StatelessComponent<InnerProps> = ({
  local: { assetID, assetURL },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query AppQuery($assetID: ID, $assetURL: String) {
        asset(id: $assetID, url: $assetURL) {
          commentCounts {
            totalVisible
          }
        }
      }
    `}
    variables={{
      assetID,
      assetURL,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer(
  graphql`
    fragment AppQueryLocal on Local {
      assetID
      assetURL
    }
  `
)(AppQuery);

export default enhanced;
