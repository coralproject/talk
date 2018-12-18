import React, { Component } from "react";

import WizardContainer from "../containers/WizardContainer";
import MainBar from "./MainBar";

import styles from "./App.css";

class App extends Component {
  public render() {
    return (
      <div className={styles.root}>
        <MainBar />
        <div className={styles.container}>
          <WizardContainer />
        </div>
      </div>
    );
  }
}

export default App;
