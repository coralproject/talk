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
    return (
      <div className={styles.root}>
        <MainBar />
        <div className={styles.container}>
          <Wizard
            currentStep={this.props.currentStep}
            goToNextStep={this.props.goToNextStep}
            goToPreviousStep={this.props.goToPreviousStep}
            goToStep={this.props.goToStep}
            className={styles.panes}
          >
            <InitialStep />
            <AddOrganizationContainer
              data={this.props.data}
              saveData={this.props.saveData}
            />
            <CreateYourAccountContainer
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
