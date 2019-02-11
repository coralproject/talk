import React from "react";

import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";
import { AppContainerLocal as Local } from "talk-stream/__generated__/AppContainerLocal.graphql";

import App from "../components/App";

interface Props {
  local: Local;
}

class AppContainer extends React.Component<Props> {
  public render() {
    const {
      local: { activeTab },
    } = this.props;

    return <App activeTab={activeTab} />;
  }
}

const enhanced = withLocalStateContainer(
  graphql`
    fragment AppContainerLocal on Local {
      activeTab
    }
  `
)(AppContainer);

export default enhanced;
