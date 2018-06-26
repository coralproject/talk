import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import {
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";
import { AppContainer as Data } from "talk-stream/__generated__/AppContainer.graphql";
import { AppContainerLocal as Local } from "talk-stream/__generated__/AppContainerLocal.graphql";

import App from "../components/App";

interface InnerProps {
  data: Data;
  local: Local;
}

const AppContainer: StatelessComponent<InnerProps> = props => {
  return <App {...props.data} />;
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment AppContainerLocal on Local {
      network {
        isOffline
      }
    }
  `
)(
  withFragmentContainer<{ data: Data }>(
    graphql`
      fragment AppContainer on Query {
        comments {
          id
          ...CommentContainer
        }
      }
    `
  )(AppContainer)
);

export type AppContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
