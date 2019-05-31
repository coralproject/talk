import React from "react";

import { graphql, withLocalStateContainer } from "coral-framework/lib/relay";
import { AppContainerLocal as Local } from "coral-stream/__generated__/AppContainerLocal.graphql";

import {
  OnEvents,
  OnPostMessageSetAccessToken,
  OnPymLogin,
  OnPymLogout,
  OnPymSetCommentID,
} from "./listeners";

const listeners = (
  <>
    <OnPymLogin />
    <OnPymLogout />
    <OnPymSetCommentID />
    <OnPostMessageSetAccessToken />
    <OnEvents />
  </>
);

import App from "./App";

interface Props {
  disableListeners?: boolean;
  local: Local;
}

class AppContainer extends React.Component<Props> {
  public render() {
    const {
      local: { activeTab },
    } = this.props;

    return (
      <>
        {this.props.disableListeners ? null : listeners}
        <App activeTab={activeTab} />
      </>
    );
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
