import React, { StatelessComponent } from "react";
import { HorizontalGutter } from "talk-ui/components";
import styles from "./App.css";
import Navigation from "./Navigation";

const App: StatelessComponent = ({ children }) => (
  <HorizontalGutter className={styles.root}>
    <Navigation />
    {children}
  </HorizontalGutter>
);

export default App;
