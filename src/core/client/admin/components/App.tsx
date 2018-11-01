import React, { StatelessComponent } from "react";

import styles from "./App.css";
import AppBar from "./AppBar";
import Navigation from "./Navigation";

const App: StatelessComponent = ({ children }) => (
  <div>
    <AppBar>
      <Navigation />
    </AppBar>
    <div className={styles.container}>{children}</div>
  </div>
);

export default App;
