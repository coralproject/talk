import React, { Component } from "react";

import InstallWizard from "./InstallWizard";
import MainBar from "./MainBar";

import styles from "./App.css";

class App extends Component {
  public render() {
    return (
      <div className={styles.root}>
        <MainBar />
        <div className={styles.container}>
          <InstallWizard />
        </div>
      </div>
    );
  }
}

export default App;
