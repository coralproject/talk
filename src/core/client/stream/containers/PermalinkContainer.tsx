import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
import { withLocalStateContainer } from "talk-framework/lib/relay";
import { AppQueryLocal as Local } from "talk-stream/__generated__/AppQueryLocal.graphql";

import Permalink from "../components/Permalink/Permalink";

interface InnerProps {
  local: Local;
  commentID: string;
}

export const PermalinkContainer: StatelessComponent<InnerProps> = ({
  local,
  commentID,
}) => {
  return local.assetURL ? (
    <Permalink assetURL={local.assetURL} commentID={commentID} />
  ) : null;
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment PermalinkContainerLocal on Local {
      assetURL
    }
  `
)(PermalinkContainer);

export default enhanced;
