import React, { Component } from "react";
import Wizard from "../components/Wizard";
import FinalStep from "../steps/components/FinalStep";
import InitialStep from "../steps/components/InitialStep";
import AddOrganizationContainer from "../steps/containers/AddOrganizationContainer";
import CreateYourAccountContainer from "../steps/containers/CreateYourAccountContainer";
import PermittedDomainsContainer from "../steps/containers/PermittedDomainsContainer";
import { FormData } from "./AppContainer";

interface WizardContainerProps {
  saveData: (newData: {}) => void;
  data: FormData;
}

interface WizardContainerState {
  step: number;
}

class WizardContainer extends Component<
  WizardContainerProps,
  WizardContainerState
> {
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
      <Wizard
        currentStep={this.state.step}
        goToNextStep={this.goToNextStep}
        goToPreviousStep={this.goToPreviousStep}
        goToStep={this.goToStep}
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
    );
  }
}

export default WizardContainer;
