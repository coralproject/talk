import React, { Component } from "react";
import * as styles from "./App.css";

import MainBar from "./MainBar";
import Wizard from "./Wizard";

import InitialStep from "../steps/InitialStep";

interface AppState {
  step: number;
}

class App extends Component<{}, AppState> {
  public state = { step: 0 };

  private nextStep = () =>
    this.setState(({ step }) => ({
      step: step + 1,
    }));

  private previousStep = () =>
    this.setState(({ step }) => ({
      step: step - 1,
    }));

  private goToStep = (step: number) =>
    this.setState({
      step,
    });

  public render() {
    return (
      <div className={styles.root}>
        <MainBar />
        <div className={styles.container}>
          <Wizard
            currentStep={this.state.step}
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            goToStep={this.goToStep}
          >
            <InitialStep />
            <div>Step 2!</div>
            <div>Step 3!</div>
            <div>Step 4!</div>
          </Wizard>
        </div>
      </div>
    );
  }
}

export default App;
