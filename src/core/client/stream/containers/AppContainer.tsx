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
  return <App {...props.data} />;
};

const enhanced = withFragmentContainer<{ data: Data }>(
  graphql`
    fragment AppContainer on Query
      @argumentDefinitions(
        assetID: { type: "ID!" }
        commentID: { type: "ID" }
        showAssetList: { type: "Boolean!" }
        showPermalink: { type: "Boolean!" }
      ) {
      comment(id: $commentID) @include(if: $showPermalink) {
        id
      }
      assets @include(if: $showAssetList) {
        ...AssetListContainer_assets
      }
      asset(id: $assetID) @skip(if: $showAssetList) {
        id
        isClosed
        comments {
          ...StreamContainer_comments
        }
      }
    }
  `
)(AppContainer);

export type AppContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
