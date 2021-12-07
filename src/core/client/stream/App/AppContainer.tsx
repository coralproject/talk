import React from "react";
import { graphql } from "react-relay";

import { withLocalStateContainer } from "coral-framework/lib/relay";

import { AppContainerLocal as Local } from "coral-stream/__generated__/AppContainerLocal.graphql";

import App from "./App";
import {
  OnEmbedLogin,
  OnEmbedLogout,
  OnEmbedSetCommentID,
  OnEventsForRudderStack,
  OnPostMessageSetAccessToken,
} from "./listeners";
import RefreshTokenHandler from "./RefreshTokenHandler";

const listeners = (
  <>
    <OnEmbedLogin />
    <OnEmbedLogout />
    <OnEmbedSetCommentID />
    <OnPostMessageSetAccessToken />
    <OnEventsForRudderStack />
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
