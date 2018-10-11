import React, { Component } from "react";
import * as styles from "./App.css";

import WizardContainer from "../containers/WizardContainer";
import MainBar from "./MainBar";

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
