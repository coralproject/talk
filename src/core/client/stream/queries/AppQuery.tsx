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

interface WrappedProps {
  data: any;
}

// TODO (bc) Break down the needs of each component into another file (maybe).
// (careful porting QueryRenderer into another stateless component)

export const renderWrapper = (
  WrappedComponent: React.ComponentType<WrappedProps>
) => ({ error, props }: ReadyState<AppQueryResponse>) => {
  if (error) {
    return <div>{error.message}</div>;
  }
  if (props) {
    return <WrappedComponent data={props} />;
  }
  return <div>Loading</div>;
};

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
        render={renderWrapper(PermalinkViewContainer)}
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
      render={renderWrapper(AppContainer)}
    />
  );
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment AppQueryLocal on Local {
      assetID
      commentID
      assetURL
    }
  `
)(AppQuery);

export default enhanced;
