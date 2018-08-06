import * as React from "react";
import { StatelessComponent } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import {
  PermalinkViewQueryResponse,
  PermalinkViewQueryVariables,
} from "talk-stream/__generated__/PermalinkViewQuery.graphql";
import { PermalinkViewQueryLocal as Local } from "talk-stream/__generated__/PermalinkViewQueryLocal.graphql";

import PermalinkViewContainer from "../containers/PermalinkViewContainer";

interface InnerProps {
  local: Local;
}

export const render = ({
  error,
  props,
}: ReadyState<PermalinkViewQueryResponse>) => {
  if (error) {
    return <div>{error.message}</div>;
  }
  if (props) {
    return (
      <PermalinkViewContainer asset={props.asset} comment={props.comment} />
    );
  }
  return <div>Loading</div>;
};

const PermalinkViewQuery: StatelessComponent<InnerProps> = ({
  local: { commentID, assetID },
}) => (
  <QueryRenderer<PermalinkViewQueryVariables, PermalinkViewQueryResponse>
    query={graphql`
      query PermalinkViewQuery($assetID: ID!, $commentID: ID!) {
        asset(id: $assetID) {
          ...PermalinkViewContainer_asset
        }
        comment(id: $commentID) {
          ...PermalinkViewContainer_comment
        }
      }
    `}
    variables={{
      assetID,
      commentID,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment PermalinkViewQueryLocal on Local {
      assetID
      commentID
    }
  `
)(PermalinkViewQuery);

export default enhanced;
