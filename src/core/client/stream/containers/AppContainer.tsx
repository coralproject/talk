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
  onsetActiveTab: SetActiveTabMutation;
}

const AppContainer: StatelessComponent<InnerProps> = ({
  local: { activeTab, authToken },
  setActiveTab,
}) => {
  return (
    <App
      activeTab={activeTab}
      onActiveTab={setActiveTab}
      signedIn={!!authToken}
    />
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment AppContainerLocal on Local {
      activeTab
      authToken
    }
  `
)(withSetActiveTabMutation(AppContainer));

export default enhanced;
