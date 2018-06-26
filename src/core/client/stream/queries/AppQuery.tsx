import * as React from "react";
import { StatelessComponent } from "react";

import { graphql, QueryRenderer, ReadyState } from "talk-framework/lib/relay";
import {
  AppQueryResponse,
  AppQueryVariables,
} from "talk-stream/__generated__/AppQuery.graphql";

import AppContainer from "../containers/AppContainer";

const render = ({ error, props }: ReadyState<AppQueryResponse>) => {
  if (error) {
    return <div>{error.message}</div>;
  }
  if (props) {
    return <AppContainer data={props} />;
  }
  return <div>Loading</div>;
};

const AppQuery: StatelessComponent = () => (
  <QueryRenderer<AppQueryVariables, AppQueryResponse>
    query={graphql`
      query AppQuery {
        ...AppContainer
      }
    `}
    variables={{}}
    render={render}
  />
);

export default AppQuery;
