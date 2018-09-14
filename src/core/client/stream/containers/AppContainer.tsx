import * as React from "react";
import { StatelessComponent } from "react";

import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";
import { AppContainerLocal as Local } from "talk-stream/__generated__/AppContainerLocal.graphql";
import {
  SetActiveTabMutation,
  withSetActiveTabMutation,
} from "talk-stream/mutations";

import App from "../components/App";

interface InnerProps {
  local: Local;
  setActiveTab: SetActiveTabMutation;
}

const AppContainer: StatelessComponent<InnerProps> = ({
  local: { activeTab },
  setActiveTab,
}) => {
  return <App activeTab={activeTab} setActiveTab={setActiveTab} />;
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment AppContainerLocal on Local {
      activeTab
    }
  `
)(withSetActiveTabMutation(AppContainer));

export default enhanced;
