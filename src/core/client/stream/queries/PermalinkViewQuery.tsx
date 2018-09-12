import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { PermalinkViewQuery as QueryTypes } from "talk-stream/__generated__/PermalinkViewQuery.graphql";
import { PermalinkViewQueryLocal as Local } from "talk-stream/__generated__/PermalinkViewQueryLocal.graphql";

import { Spinner } from "talk-ui/components";
import PermalinkViewContainer from "../containers/PermalinkViewContainer";

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
        <Localized id="comments-permalinkViewQuery-assetNotFound">
          <div>Asset not found</div>
        </Localized>
      );
    }
    return (
      <PermalinkViewContainer
        me={props.me}
        comment={props.comment}
        asset={props.asset}
      />
    );
  }
  return <Spinner />;
};

const PermalinkViewQuery: StatelessComponent<InnerProps> = ({
  local: { commentID, assetID },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query PermalinkViewQuery($commentID: ID!, $assetID: ID!) {
        me {
          ...PermalinkViewContainer_me
        }
        asset(id: $assetID) {
          ...PermalinkViewContainer_asset
        }
        comment(id: $commentID) {
          ...PermalinkViewContainer_comment
        }
      }
    `}
    variables={{
      assetID: assetID!,
      commentID: commentID!,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer(
  graphql`
    fragment PermalinkViewQueryLocal on Local {
      assetID
      commentID
    }
  `
)(PermalinkViewQuery);

export default enhanced;
