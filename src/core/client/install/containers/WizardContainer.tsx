import React, { Component } from "react";
import Wizard from "../components/Wizard";
import FinalStep from "../steps/components/FinalStep";
import InitialStep from "../steps/components/InitialStep";
import AddOrganizationContainer from "../steps/containers/AddOrganizationContainer";
import CreateYourAccountContainer from "../steps/containers/CreateYourAccountContainer";
import PermittedDomainsContainer from "../steps/containers/PermittedDomainsContainer";
import { FormData } from "./AppContainer";

interface WizardContainerProps {
  onSaveData: (newData: {}) => void;
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

  private onGoToNextStep = () =>
    this.setState(({ step }) => ({
      step: step + 1,
    }));

  private onGoToPreviousStep = () =>
    this.setState(({ step }) => ({
      step: step - 1,
    }));

  private onGoToStep = (step: number) =>
    this.setState({
      step,
    });

  public render() {
    return (
      <Wizard
        currentStep={this.state.step}
        onGoToNextStep={this.onGoToNextStep}
        onGoToPreviousStep={this.onGoToPreviousStep}
        onGoToStep={this.onGoToStep}
      >
        <InitialStep />
        <CreateYourAccountContainer
          data={this.props.data}
          onSaveData={this.props.onSaveData}
        />
        <AddOrganizationContainer
          data={this.props.data}
          onSaveData={this.props.onSaveData}
        />
        <PermittedDomainsContainer
          data={this.props.data}
          onSaveData={this.props.onSaveData}
        />
        <FinalStep />
      </Wizard>
    );
  }
}

export default WizardContainer;
