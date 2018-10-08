import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { ReadyState } from "react-relay";
import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { StreamQuery as QueryTypes } from "talk-stream/__generated__/StreamQuery.graphql";
import { StreamQueryLocal as Local } from "talk-stream/__generated__/StreamQueryLocal.graphql";
import { Spinner } from "talk-ui/components";
import StreamContainer from "../containers/StreamContainer";

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
      <StreamContainer
        settings={props.settings}
        me={props.me}
        asset={props.asset}
      />
    );
  }

  return <Spinner />;
};

const StreamQuery: StatelessComponent<InnerProps> = ({
  local: { assetID, assetURL },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query StreamQuery($assetID: ID, $assetURL: String) {
        me {
          ...StreamContainer_me
        }
        asset(id: $assetID, url: $assetURL) {
          ...StreamContainer_asset
        }
        settings {
          ...StreamContainer_settings
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
    fragment StreamQueryLocal on Local {
      assetID
      assetURL
    }
  `
)(StreamQuery);

export default enhanced;
