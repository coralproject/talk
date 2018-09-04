import * as React from "react";
import { StatelessComponent } from "react";

import { AppContainerLocal as Local } from "talk-auth/__generated__/AppContainerLocal.graphql";
import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";

import App from "../components/App";

interface InnerProps {
  local: Local;
}

const AppContainer: StatelessComponent<InnerProps> = ({ local: { view } }) => {
  return <App view={view} />;
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment AppContainerLocal on Local {
      view
    }
  `
)(AppContainer);

export default enhanced;
