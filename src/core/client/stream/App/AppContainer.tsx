import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useLocal } from "coral-framework/lib/relay";

import { AppContainerLocal$data as AppContainerLocal } from "coral-stream/__generated__/AppContainerLocal.graphql";

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
  const [{ activeTab }] = useLocal<AppContainerLocal>(graphql`
    fragment AppContainerLocal on Local {
      activeTab
    }
  `);
  return (
    <RenderTargetContextProvider>
      {disableListeners ? null : listeners}
      <RefreshTokenHandler />
      <App activeTab={activeTab} />
    </RenderTargetContextProvider>
  );
};

export default AppContainer;
