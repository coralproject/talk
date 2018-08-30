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
    return <PermalinkViewContainer comment={props.comment} />;
  }
  return <Spinner />;
};

const PermalinkViewQuery: StatelessComponent<InnerProps> = ({
  local: { commentID },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query PermalinkViewQuery($commentID: ID!) {
        comment(id: $commentID) {
          ...PermalinkViewContainer_comment
        }
      }
    `}
    variables={{
      commentID: commentID!,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment PermalinkViewQueryLocal on Local {
      commentID
    }
  `
)(PermalinkViewQuery);

export default enhanced;
