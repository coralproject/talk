import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";
import { AppContainer as Data } from "talk-stream/__generated__/AppContainer.graphql";

import App from "../components/App";

interface InnerProps {
  data: Data;
}

export const AppContainer: StatelessComponent<InnerProps> = props => {
  return <App {...props.data} />;
};

const enhanced = withFragmentContainer<{ data: Data }>({
  data: graphql`
    fragment AppContainer on Query
      @argumentDefinitions(assetID: { type: "ID!" }) {
      asset(id: $assetID) {
        ...StreamContainer_asset
      }
    }
  `,
})(AppContainer);

export type AppContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
