import React, { FunctionComponent } from "react";

import { useStreamLocal } from "coral-stream/local/StreamLocal";

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
  const { activeTab } = useStreamLocal();

  return (
    <RenderTargetContextProvider>
      {disableListeners ? null : listeners}
      <RefreshTokenHandler />
      <App activeTab={activeTab} />
    </RenderTargetContextProvider>
  );
};

export default AppContainer;
