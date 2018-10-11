import React, { Component } from "react";

import Wizard from "../components/Wizard";
import { InstallMutation, withInstallMutation } from "../mutations";
import FinalStep from "../steps/components/FinalStep";
import InitialStep from "../steps/components/InitialStep";
import AddOrganizationContainer from "../steps/containers/AddOrganizationContainer";
import CreateYourAccountContainer from "../steps/containers/CreateYourAccountContainer";
import PermittedDomainsContainer from "../steps/containers/PermittedDomainsContainer";

import { InstallInput } from "talk-framework/rest";

export interface FormData {
  organizationName: string;
  organizationContactEmail: string;
  organizationURL: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  domains: string[];
}

interface WizardContainerState {
  step: number;
  data: FormData;
}

function shapeFinalData(data: FormData): InstallInput {
  const {
    organizationName,
    organizationContactEmail,
    organizationURL,
    domains,
    username,
    password,
    email,
  } = data;

  return {
    tenant: {
      organizationName,
      organizationContactEmail,
      organizationURL,
      domains,
    },
    user: {
      username,
      password,
      email,
    },
  };
}

interface Props {
  install: InstallMutation;
}

class WizardContainer extends Component<Props, WizardContainerState> {
  public state = {
    step: 0,
    data: {
      organizationContactEmail: "",
      organizationName: "",
      organizationURL: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      domains: [],
    },
  };

  private handleSaveData = (newData: FormData) => {
    this.setState(({ data }) => ({
      data: { ...data, ...newData },
    }));
  };

  private handleGoToNextStep = () =>
    this.setState(({ step }) => ({
      step: step + 1,
    }));

  private handleGoToPreviousStep = () =>
    this.setState(({ step }) => ({
      step: step - 1,
    }));

  private handleInstall = async (newData: Partial<FormData>) => {
    return await this.props.install(
      shapeFinalData({ ...this.state.data, ...newData })
    );
  };

  public render() {
    return (
      <Wizard currentStep={this.state.step}>
        <InitialStep onGoToNextStep={this.handleGoToNextStep} />
        <CreateYourAccountContainer
          data={this.state.data}
          onSaveData={this.handleSaveData}
          onGoToNextStep={this.handleGoToNextStep}
          onGoToPreviousStep={this.handleGoToPreviousStep}
        />
        <AddOrganizationContainer
          data={this.state.data}
          onSaveData={this.handleSaveData}
          onGoToNextStep={this.handleGoToNextStep}
          onGoToPreviousStep={this.handleGoToPreviousStep}
        />
        <PermittedDomainsContainer
          data={this.state.data}
          onGoToNextStep={this.handleGoToNextStep}
          onGoToPreviousStep={this.handleGoToPreviousStep}
          onInstall={this.handleInstall}
        />
        <FinalStep />
      </Wizard>
    );
  }
}

export default withInstallMutation(WizardContainer);
