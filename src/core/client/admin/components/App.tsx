import React, { StatelessComponent } from "react";
import { HorizontalGutter } from "talk-ui/components";
import styles from "./App.css";
import Navigation from "./Navigation";

const App: StatelessComponent = ({ children }) => (
  <div className={styles.root}>
    <HorizontalGutter>
      <Navigation />
      {children}
    </HorizontalGutter>
  </div>
);

export default App;
