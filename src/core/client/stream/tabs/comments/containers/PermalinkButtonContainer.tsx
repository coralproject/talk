import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
import { getURLWithCommentID } from "talk-framework/helpers";
import { withLocalStateContainer } from "talk-framework/lib/relay";
import { PermalinkButtonContainerLocal as Local } from "talk-stream/__generated__/PermalinkButtonContainerLocal.graphql";

import PermalinkButton from "../components/PermalinkButton";

interface InnerProps {
  local: Local;
  commentID: string;
}

export const PermalinkContainer: StatelessComponent<InnerProps> = ({
  local,
  commentID,
}) => {
  return local.assetURL ? (
    <PermalinkButton
      commentID={commentID}
      url={getURLWithCommentID(local.assetURL, commentID)}
    />
  ) : null;
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment PermalinkButtonContainerLocal on Local {
      assetURL
    }
  `
)(PermalinkContainer);

export default enhanced;
