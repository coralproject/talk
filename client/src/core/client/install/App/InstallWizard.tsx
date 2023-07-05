import React, { Component } from "react";

import { LanguageCode } from "coral-common/helpers/i18n";
import { InstallInput } from "coral-framework/rest";

import { InstallMutation, withInstallMutation } from "./InstallMutation";
import AddOrganizationStep from "./steps/AddOrganizationStep";
import CreateYourAccountStep from "./steps/CreateYourAccountStep";
import FinalStep from "./steps/FinalStep";
import InitialStep from "./steps/InitialStep";
import PermittedDomainsStep from "./steps/PermittedDomainsStep";
import SelectLanguageStep from "./steps/SelectLanguageStep";
import Wizard from "./Wizard";

interface FormData {
  organizationName: string;
  siteName: string;
  siteContactEmail: string;
  siteURL: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  allowedOrigins: string[];
  locale: LanguageCode;
}

interface InstallWizardState {
  step: number;
  data: FormData;
}

function shapeFinalData(data: FormData): InstallInput {
  const {
    organizationName,
    siteName,
    siteContactEmail,
    siteURL,
    allowedOrigins,
    username,
    password,
    email,
    locale,
  } = data;

  return {
    tenant: {
      organization: {
        name: organizationName,
        contactEmail: siteContactEmail,
        url: siteURL,
      },
      locale,
    },
    site: {
      name: siteName,
      contactEmail: siteContactEmail,
      url: siteURL,
      allowedOrigins,
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
      organizationName: "",
      siteContactEmail: "",
      siteName: "",
      siteURL: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      allowedOrigins: [],
      locale: "en-US" as LanguageCode,
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
        <SelectLanguageStep
          data={this.state.data}
          onSaveData={this.handleSaveData}
          onGoToNextStep={this.handleGoToNextStep}
          onGoToPreviousStep={this.handleGoToPreviousStep}
        />
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
