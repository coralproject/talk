import * as React from "react";
import { StatelessComponent } from "react";

import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";
import { AppContainerLocal as Local } from "talk-stream/__generated__/AppContainerLocal.graphql";

import App from "../components/App";

interface InnerProps {
  local: Local;
}

const AppContainer: StatelessComponent<InnerProps> = ({
  local: { commentID },
}) => {
  return <App showPermalinkView={!!commentID} />;
};

const enhanced = withLocalStateContainer<Local>(
  graphql`
    fragment AppContainerLocal on Local {
      commentID
    }
  `
)(AppContainer);

export default enhanced;
