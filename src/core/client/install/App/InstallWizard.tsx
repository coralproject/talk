import React, { Component } from "react";

import { InstallInput } from "coral-framework/rest";

import { InstallMutation, withInstallMutation } from "./InstallMutation";
import AddOrganizationStep from "./steps/AddOrganizationStep";
import CreateYourAccountStep from "./steps/CreateYourAccountStep";
import FinalStep from "./steps/FinalStep";
import InitialStep from "./steps/InitialStep";
import PermittedDomainsStep from "./steps/PermittedDomainsStep";
import Wizard from "./Wizard";

interface FormData {
  organizationName: string;
  organizationContactEmail: string;
  organizationURL: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  allowedDomains: string[];
}

interface InstallWizardState {
  step: number;
  data: FormData;
}

function shapeFinalData(data: FormData): InstallInput {
  const {
    organizationName,
    organizationContactEmail,
    organizationURL,
    allowedDomains,
    username,
    password,
    email,
  } = data;

  return {
    tenant: {
      organization: {
        name: organizationName,
        contactEmail: organizationContactEmail,
        url: organizationURL,
      },
      allowedDomains,
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

class InstallWizard extends Component<Props, InstallWizardState> {
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
      allowedDomains: [],
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
        <CreateYourAccountStep
          data={this.state.data}
          onSaveData={this.handleSaveData}
          onGoToNextStep={this.handleGoToNextStep}
          onGoToPreviousStep={this.handleGoToPreviousStep}
        />
        <AddOrganizationStep
          data={this.state.data}
          onSaveData={this.handleSaveData}
          onGoToNextStep={this.handleGoToNextStep}
          onGoToPreviousStep={this.handleGoToPreviousStep}
        />
        <PermittedDomainsStep
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

export default withInstallMutation(InstallWizard);
