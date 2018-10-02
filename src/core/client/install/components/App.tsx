import React, { Component } from "react";
import * as styles from "./App.css";

import { FormData } from "../containers/AppContainer";
import FinalStep from "../steps/components/FinalStep";
import InitialStep from "../steps/components/InitialStep";
import AddOrganizationContainer from "../steps/containers/AddOrganizationContainer";
import CreateYourAccountContainer from "../steps/containers/CreateYourAccountContainer";
import PermittedDomainsContainer from "../steps/containers/PermittedDomainsContainer";
import MainBar from "./MainBar";
import Wizard from "./Wizard";

export interface AppProps {
  currentStep: number;
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  goToStep: (step: number) => void;
  saveData: (newData: {}) => void;
  data: Partial<FormData>;
}

class App extends Component<AppProps> {
  public render() {
    const {
      currentStep,
      goToNextStep,
      goToPreviousStep,
      goToStep,
    } = this.props;
    return (
      <div className={styles.root}>
        <MainBar />
        <div className={styles.container}>
          <Wizard
            currentStep={currentStep}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            goToStep={goToStep}
            className={styles.panes}
          >
            <InitialStep />
            <CreateYourAccountContainer
              data={this.props.data}
              saveData={this.props.saveData}
            />
            <AddOrganizationContainer
              data={this.props.data}
              saveData={this.props.saveData}
            />
            <PermittedDomainsContainer
              data={this.props.data}
              saveData={this.props.saveData}
            />
            <FinalStep />
          </Wizard>
        </div>
      </div>
    );
  }
}

export default App;
