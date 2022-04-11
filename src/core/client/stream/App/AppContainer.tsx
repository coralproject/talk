import React, { FunctionComponent, useContext } from "react";

import { StreamLocalContext } from "coral-stream/local/StreamLocalProvider";

import { RenderTargetContextProvider } from "../renderTarget";
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
}

const AppContainer: FunctionComponent<Props> = ({ disableListeners }) => {
  const local = useContext(StreamLocalContext);
  if (!local) {
    return null;
  }

  return (
    <RenderTargetContextProvider>
      {disableListeners ? null : listeners}
      <RefreshTokenHandler />
      <App activeTab={local.activeTab} />
    </RenderTargetContextProvider>
  );
};

export default AppContainer;
