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
  me: PropTypesOf<typeof UserMenuContainer>["me"];
}

const App: StatelessComponent<Props> = ({ children, me }) => (
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
        <UserMenuContainer me={me} />
      </End>
    </AppBar>
    {children}
  </div>
);

export default App;
