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
    return <StreamContainer asset={props.asset} user={props.me} />;
  }

  return <Spinner />;
};

const StreamQuery: StatelessComponent<InnerProps> = ({
  local: { assetID, authRevision },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query StreamQuery($assetID: ID!, $authRevision: Int!) {
        # authRevision is increment every time auth state has changed.
        # This is basically a cache invalidation and causes relay
        # to automatically update this query.
        me(clientAuthRevision: $authRevision) {
          ...StreamContainer_user
        }
        asset(id: $assetID) {
          ...StreamContainer_asset
        }
      }
    `}
    variables={{
      assetID: assetID!,
      authRevision,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer(
  graphql`
    fragment StreamQueryLocal on Local {
      assetID
      authRevision
    }
  `
)(StreamQuery);

export default enhanced;
