import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Logo } from "talk-ui/components";
import { AppBar, Begin, Divider, End } from "talk-ui/components/AppBar";

import UserMenuContainer from "../containers/UserMenuContainer";
import DecisionHistoryButton from "./DecisionHistoryButton";
import Navigation from "./Navigation";
import Version from "./Version";

import styles from "./App.css";

interface Props {
  viewer: PropTypesOf<typeof UserMenuContainer>["viewer"];
  children: React.ReactNode;
}

const App: StatelessComponent<Props> = ({ children, viewer }) => (
  <div className={styles.root}>
    <AppBar gutterBegin gutterEnd>
      <Begin itemGutter="double">
        <div className={styles.logoContainer}>
          <Logo />
          <Version />
        </div>
        <Navigation />
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
