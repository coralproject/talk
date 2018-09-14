import * as React from "react";
import { StatelessComponent } from "react";

import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";
import { AppContainerLocal as Local } from "talk-stream/__generated__/AppContainerLocal.graphql";

import App from "../components/App";

interface InnerProps {
  local: Local;
}

const AppContainer: StatelessComponent<InnerProps> = ({
  local: { activeTab },
}) => {
  return <App activeTab={activeTab} />;
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment AppContainerLocal on Local {
      activeTab
    }
  `
)(AppContainer);

export default enhanced;
