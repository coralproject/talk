import React, { Component } from "react";
import * as styles from "./App.css";

import MainBar from "./MainBar";
import Wizard from "./Wizard";

import FinalStep from "../steps/components/FinalStep";
import InitialStep from "../steps/components/InitialStep";
import AddOrganizationContainer from "../steps/containers/AddOrganizationContainer";
import CreateYourAccountContainer from "../steps/containers/CreateYourAccountContainer";
import PermittedDomainsContainer from "../steps/containers/PermittedDomainsContainer";

interface AppState {
  step: number;
}

class App extends Component<{}, AppState> {
  public state = {
    step: 0,
  };

  private goToNextStep = () =>
    this.setState(({ step }) => ({
      step: step + 1,
    }));

  private goToPreviousStep = () =>
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
            goToNextStep={this.goToNextStep}
            goToPreviousStep={this.goToPreviousStep}
            goToStep={this.goToStep}
            className={styles.panes}
          >
            <InitialStep />
            <AddOrganizationContainer />
            <CreateYourAccountContainer />
            <PermittedDomainsContainer />
            <FinalStep />
          </Wizard>
        </div>
      </div>
    );
  }
}

export default App;
