import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";
import { AssetListContainer_assets as Data } from "talk-stream/__generated__/AssetListContainer_assets.graphql";

import AssetList from "../components/AssetList";

interface InnerProps {
  assets: Data;
}

const AssetListContainer: StatelessComponent<InnerProps> = props => {
  const assets = props.assets.edges.map(edge => edge.node);
  return <AssetList assets={assets} />;
};

const enhanced = withFragmentContainer<{ assets: Data }>({
  assets: graphql`
    fragment AssetListContainer_assets on AssetsConnection {
      edges {
        node {
          id
          title
        }
      }
    }
  `,
})(AssetListContainer);

export type AssetListContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
