import React, { StatelessComponent } from "react";

import { Logo } from "talk-ui/components";
import { AppBar, Begin, Divider, End } from "talk-ui/components/AppBar";

import SignOutButtonContainer from "../containers/SignOutButtonContainer";
import styles from "./App.css";
import DecisionHistoryButton from "./DecisionHistoryButton";
import Navigation from "./Navigation";

const App: StatelessComponent = ({ children }) => (
  <div>
    <AppBar gutterBegin gutterEnd>
      <Begin itemGutter="double">
        <Logo />
        <Navigation />
      </Begin>
      <End>
        <DecisionHistoryButton />
        <Divider />
        <SignOutButtonContainer id="navigation-signOutButton" />
      </End>
    </AppBar>
    <div className={styles.container}>{children}</div>
  </div>
);

export default App;
