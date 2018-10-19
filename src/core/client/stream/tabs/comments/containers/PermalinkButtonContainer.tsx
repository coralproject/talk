import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
import { getURLWithCommentID } from "talk-framework/helpers";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PermalinkButtonContainer_asset as AssetData } from "talk-stream/__generated__/PermalinkButtonContainer_asset.graphql";

import PermalinkButton from "../components/PermalinkButton";

interface InnerProps {
  asset: AssetData;
  commentID: string;
}

export const PermalinkButtonContainerProps: StatelessComponent<InnerProps> = ({
  asset,
  commentID,
}) => {
  return (
    <PermalinkButton
      commentID={commentID}
      url={getURLWithCommentID(asset.url, commentID)}
    />
  );
};

const enhanced = withFragmentContainer<InnerProps>({
  asset: graphql`
    fragment PermalinkButtonContainer_asset on Asset {
      url
    }
  `,
})(PermalinkButtonContainerProps);

export default enhanced;
