import React from "react";
import { graphql } from "react-relay";

import { withLocalStateContainer } from "coral-framework/lib/relay";
import AuthPopup from "coral-stream/common/AuthPopup";

import { AppContainerLocal as Local } from "coral-stream/__generated__/AppContainerLocal.graphql";

import App from "./App";
import {
  OnEvents,
  OnPostMessageSetAccessToken,
  OnPymLogin,
  OnPymLogout,
  OnPymSetCommentID,
} from "./listeners";
import RefreshTokenHandler from "./RefreshTokenHandler";

const listeners = (
  <>
    <OnPymLogin />
    <OnPymLogout />
    <OnPymSetCommentID />
    <OnPostMessageSetAccessToken />
    <OnEvents />
  </>
);

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
        <RefreshTokenHandler />
        <AuthPopup />
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
