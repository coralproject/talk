import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
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
    <PermalinkButton assetURL={local.assetURL} commentID={commentID} />
  ) : null;
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment PermalinkButtonContainerLocal on Local {
      assetURL
    }
  `
)(PermalinkContainer);

export default enhanced;
