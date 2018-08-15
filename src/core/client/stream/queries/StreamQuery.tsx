import * as React from "react";
import { StatelessComponent } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import {
  StreamQueryResponse,
  StreamQueryVariables,
} from "talk-stream/__generated__/StreamQuery.graphql";
import { StreamQueryLocal as Local } from "talk-stream/__generated__/StreamQueryLocal.graphql";

import StreamContainer from "../containers/StreamContainer";

interface InnerProps {
  local: Local;
}

export const render = ({ error, props }: ReadyState<StreamQueryResponse>) => {
  if (error) {
    return <div>{error.message}</div>;
  }

  if (props) {
    return <StreamContainer asset={props.asset} user={props.me} />;
  }

  return <div>Loading</div>;
};

const StreamQuery: StatelessComponent<InnerProps> = ({
  local: { assetID },
}) => (
  <QueryRenderer<StreamQueryVariables, StreamQueryResponse>
    query={graphql`
      query StreamQuery($assetID: ID!) {
        asset(id: $assetID) {
          ...StreamContainer_asset
        }
        me {
          id
          username
          displayName
          role
        }
      }
    `}
    variables={{
      assetID,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment StreamQueryLocal on Local {
      assetID
    }
  `
)(StreamQuery);

export default enhanced;
