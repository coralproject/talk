import React, { Component } from "react";
import * as styles from "./App.css";
import Wizard from "./Wizard";

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
        <Wizard
          currentStep={this.state.step}
          nextStep={this.nextStep}
          previousStep={this.previousStep}
          goToStep={this.goToStep}
        >
          <div>Hola!</div>
        </Wizard>
      </div>
    );
  }
}

export default App;
