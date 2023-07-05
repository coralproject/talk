import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useLocal } from "coral-framework/lib/relay";

import { AppContainerLocal } from "coral-stream/__generated__/AppContainerLocal.graphql";

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
}

const AppContainer: FunctionComponent<Props> = ({ disableListeners }) => {
  const [{ activeTab }] = useLocal<AppContainerLocal>(graphql`
    fragment AppContainerLocal on Local {
      activeTab
    }
  `);
  return (
    <>
      {disableListeners ? null : listeners}
      <RefreshTokenHandler />
      <App activeTab={activeTab} />
    </>
  );
};

export default AppContainer;
