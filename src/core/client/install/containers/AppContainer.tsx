import React, { Component } from "react";
import App from "../components/App";

export interface FormData {
  organizationName: string;
  organizationContactEmail: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  domains: string;
}

interface AppContainerState {
  step: number;
  data: Partial<FormData>;
}

class WizardContainer extends Component<{}, AppContainerState> {
  public state = {
    step: 0,
    data: {
      organizationContactEmail: "",
      organizationName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      domains: "",
    },
  };

  private goToNextStep = () =>
    this.setState(({ step }) => ({
      step: step + 1,
    }));

  private goToPreviousStep = () =>
    this.setState(
      ({ step }) => ({
        step: step - 1,
      }),
      () => {
        console.log(this.state);
      }
    );

  private goToStep = (step: number) =>
    this.setState({
      step,
    });

  private saveData = (newData: Partial<FormData>) =>
    this.setState(({ data }) => ({
      data: { ...data, ...newData },
    }));

  public render() {
    return (
      <App
        currentStep={this.state.step}
        goToNextStep={this.goToNextStep}
        goToPreviousStep={this.goToPreviousStep}
        goToStep={this.goToStep}
        saveData={this.saveData}
        data={this.state.data}
      />
    );
  }
}

export default WizardContainer;
