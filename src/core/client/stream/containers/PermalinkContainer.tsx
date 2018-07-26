import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
import { withLocalStateContainer } from "talk-framework/lib/relay";
import { AppQueryLocal as Local } from "talk-stream/__generated__/AppQueryLocal.graphql";

import Permalink from "../components/Permalink/Permalink";

interface InnerProps {
  local: Local;
  commentID: string;
}

export const PermalinkContainer: StatelessComponent<InnerProps> = props => {
  return (
    <Permalink
      {...props}
      origin={props.local.origin}
      assetID={props.local.assetID}
    />
  );
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment PermalinkContainerLocal on Local {
      assetID
      origin
    }
  `
)(PermalinkContainer);

export default enhanced;
