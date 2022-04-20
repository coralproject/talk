import React, { FunctionComponent } from "react";

import { useStreamLocal } from "coral-stream/local/StreamLocal";

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
  const { activeTab } = useStreamLocal();

  return (
    <>
      {disableListeners ? null : listeners}
      <RefreshTokenHandler />
      <App activeTab={activeTab} />
    </>
  );
};

export default AppContainer;
