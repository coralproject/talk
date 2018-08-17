import * as React from "react";
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
import { StatelessComponent } from "enzyme";
import { Spinner } from "talk-ui/components";

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

  return <Spinner />;
};

const StreamQuery: StatelessComponent<InnerProps> = ({
  local: { assetID, authToken },
}) => (
  <QueryRenderer<StreamQueryVariables, StreamQueryResponse>
    query={graphql`
      query StreamQuery($assetID: ID!, $signedIn: Boolean!) {
        asset(id: $assetID) {
          ...StreamContainer_asset
        }
        me @include(if: $signedIn) {
          id
          username
          displayName
          role
        }
      }
    `}
    variables={{
      assetID,
      signedIn: !!authToken,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment StreamQueryLocal on Local {
      assetID
      authToken
    }
  `
)(StreamQuery);

export default enhanced;
