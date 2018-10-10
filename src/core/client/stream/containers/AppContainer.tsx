import React from "react";

import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";
import { AppContainerLocal as Local } from "talk-stream/__generated__/AppContainerLocal.graphql";
import {
  SetActiveTabInput,
  SetActiveTabMutation,
  withSetActiveTabMutation,
} from "talk-stream/mutations";

import App from "../components/App";

interface InnerProps {
  local: Local;
  setActiveTab: SetActiveTabMutation;
}

class AppContainer extends React.Component<InnerProps> {
  private handleSetActiveTab = (tab: SetActiveTabInput["tab"]) => {
    this.props.setActiveTab({ tab });
  };

  public render() {
    const {
      local: { activeTab },
    } = this.props;

    return <App activeTab={activeTab} onTabClick={this.handleSetActiveTab} />;
  }
}

const enhanced = withSetActiveTabMutation(
  withLocalStateContainer(
    graphql`
      fragment AppContainerLocal on Local {
        activeTab
      }
    `
  )(AppContainer)
);

export default enhanced;
