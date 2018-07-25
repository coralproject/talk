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

import PermalinkViewContainer from "talk-stream/containers/PermalinkViewContainer";
import AppContainer from "../containers/AppContainer";

interface InnerProps {
  local: Local;
}

// TODO (bc) refactor this into another component. break down the needs of each component.
// (careful porting QueryRenderer into another stateless component)

const AppQuery: StatelessComponent<InnerProps> = ({
  local: { commentID, assetID },
}) => {
  if (commentID) {
    return (
      <QueryRenderer<AppQueryVariables, AppQueryResponse>
        query={graphql`
          query AppQuery_PermalinkViewContainer_Query($commentID: ID!) {
            ...PermalinkViewContainerQuery @arguments(commentID: $commentID)
          }
        `}
        variables={{
          commentID,
        }}
        render={({ error, props }: ReadyState<AppQueryResponse>) => {
          if (error) {
            return <div>{error.message}</div>;
          }
          if (props) {
            return <PermalinkViewContainer data={props} />;
          }
          return <div>Loading</div>;
        }}
      />
    );
  }

  return (
    <QueryRenderer<AppQueryVariables, AppQueryResponse>
      query={graphql`
        query AppQuery($assetID: ID!) {
          ...AppContainer @arguments(assetID: $assetID)
        }
      `}
      variables={{
        assetID,
      }}
      render={({ error, props }: ReadyState<AppQueryResponse>) => {
        if (error) {
          return <div>{error.message}</div>;
        }
        if (props) {
          return <AppContainer data={props} />;
        }
        return <div>Loading</div>;
      }}
    />
  );
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment AppQueryLocal on Local {
      assetID
      commentID
      origin
    }
  `
)(AppQuery);

export default enhanced;
