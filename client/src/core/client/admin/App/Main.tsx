import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { LogoHorizontal } from "coral-ui/components/v2";
import { AppBar, Begin, Divider, End } from "coral-ui/components/v2/AppBar";

import { DecisionHistoryButton } from "./DecisionHistory";
import {
  NotificationContainer,
  NotificationProvider,
} from "./GlobalNotification";
import NavigationContainer from "./Navigation";
import UserMenuContainer from "./UserMenu";
import Version from "./Version";

import styles from "./Main.css";

interface Props {
  viewer: PropTypesOf<typeof UserMenuContainer>["viewer"] &
    PropTypesOf<typeof NavigationContainer>["viewer"];
  children: React.ReactNode;
}

const Main: FunctionComponent<Props> = ({ children, viewer }) => (
  <div className={styles.root}>
    <AppBar gutterBegin gutterEnd>
      <Begin itemGutter="double">
        <div className={styles.logoContainer}>
          <LogoHorizontal />
        </div>
        <NavigationContainer viewer={viewer} />
      </Begin>
      <End>
        <DecisionHistoryButton />
        <Divider />
        <UserMenuContainer viewer={viewer} />
      </End>
    </AppBar>
    <NotificationProvider>
      <NotificationContainer />
      {children}
    </NotificationProvider>
    <Version />
  </div>
);

export default Main;
