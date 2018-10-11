import React, { Component } from "react";
import * as styles from "./App.css";

import { FormData } from "../containers/AppContainer";
import WizardContainer from "../containers/WizardContainer";
import MainBar from "./MainBar";

export interface AppProps {
  onSaveData: (newData: {}) => Promise<FormData>;
  data: FormData;
}

class App extends Component<AppProps> {
  public render() {
    return (
      <div className={styles.root}>
        <MainBar />
        <div className={styles.container}>
          <WizardContainer
            onSaveData={this.props.onSaveData}
            data={this.props.data}
          />
        </div>
      </div>
    );
  }
}

export default App;
