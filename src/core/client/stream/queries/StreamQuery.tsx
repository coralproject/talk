import React, { StatelessComponent } from "react";
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
import { Spinner } from "talk-ui/components";
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

  return <Spinner />;
};

const StreamQuery: StatelessComponent<InnerProps> = ({
  local: { assetID, authRevision },
}) => (
  <QueryRenderer<StreamQueryVariables, StreamQueryResponse>
    query={graphql`
      query StreamQuery($assetID: ID!, $authRevision: Int!) {
        asset(id: $assetID) {
          ...StreamContainer_asset
        }
        # authRevision is increment every time auth state has changed.
        # This is basically a cache invalidation and causes relay
        # to automatically update this query.
        me(clientAuthRevision: $authRevision) {
          ...StreamContainer_user
        }
      }
    `}
    variables={{
      assetID,
      authRevision,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment StreamQueryLocal on Local {
      assetID
      authRevision
    }
  `
)(StreamQuery);

export default enhanced;
