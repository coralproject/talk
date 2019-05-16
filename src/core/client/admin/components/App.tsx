import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Logo } from "coral-ui/components";
import { AppBar, Begin, Divider, End } from "coral-ui/components/AppBar";

import NavigationContainer from "../containers/NavigationContainer";
import UserMenuContainer from "../containers/UserMenuContainer";
import DecisionHistoryButton from "./DecisionHistoryButton";
import Version from "./Version";

import styles from "./App.css";

interface Props {
  viewer: PropTypesOf<typeof UserMenuContainer>["viewer"] &
    PropTypesOf<typeof NavigationContainer>["viewer"];
  children: React.ReactNode;
}

const App: FunctionComponent<Props> = ({ children, viewer }) => (
  <div className={styles.root}>
    <AppBar gutterBegin gutterEnd>
      <Begin itemGutter="double">
        <div className={styles.logoContainer}>
          <Logo />
          <Version />
        </div>
        <NavigationContainer viewer={viewer} />
      </Begin>
      <End>
        <DecisionHistoryButton />
        <Divider />
        <UserMenuContainer viewer={viewer} />
      </End>
    </AppBar>
    {children}
  </div>
);

export default App;
