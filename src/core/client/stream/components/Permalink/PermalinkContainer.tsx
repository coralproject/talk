import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
import { withLocalStateContainer } from "talk-framework/lib/relay";
import { AppQueryLocal as Local } from "talk-stream/__generated__/AppQueryLocal.graphql";

import Permalink from "./Permalink";

interface InnerProps {
  local: Local;
  commentID: string;
}

export const PermalinkContainer: StatelessComponent<InnerProps> = props => {
  return <Permalink {...props} origin={props.local.origin} />;
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment PermalinkContainerLocal on Local {
      origin
    }
  `
)(PermalinkContainer);

export default enhanced;
