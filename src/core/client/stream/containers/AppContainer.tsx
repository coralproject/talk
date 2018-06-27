import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";
import { AppContainer as Data } from "talk-stream/__generated__/AppContainer.graphql";

import App from "../components/App";

interface InnerProps {
  data: Data;
}

const AppContainer: StatelessComponent<InnerProps> = props => {
  return <App {...props.data as any} />;
};

const enhanced = withFragmentContainer<{ data: Data }>(
  graphql`
    fragment AppContainer on Query
      @argumentDefinitions(assetID: { type: "ID" }) {
      # TODO: connection
      __typename
    }
  `
)(AppContainer);

export type AppContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
