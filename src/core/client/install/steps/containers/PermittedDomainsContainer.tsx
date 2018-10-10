import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import { FormData } from "../../containers/AppContainer";
import PermittedDomains, {
  PermittedDomainsForm,
} from "../components/PermittedDomains";

import { InstallInput } from "talk-framework/rest";
import { InstallMutation, withInstallMutation } from "../mutations";

interface PermittedDomainsContainerProps {
  install: InstallMutation;
  onGoToNextStep?: () => void;
  onGoToPreviousStep?: () => void;
  data: FormData;
  onSaveData: (newData: {}) => void;
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

class CreateYourAccountContainer extends Component<
  PermittedDomainsContainerProps
> {
  private onGoToNextStep = () => {
    if (this.props.onGoToNextStep) {
      this.props.onGoToNextStep();
    }
  };
  private onGoToPreviousStep = () => {
    if (this.props.onGoToPreviousStep) {
      this.props.onGoToPreviousStep();
    }
  };
  private onSubmit: PermittedDomainsForm["onSubmit"] = async (input, form) => {
    try {
      const domains = input.domains.split(",");
      this.props.onSaveData({ domains });
      this.props.install(shapeFinalData(this.props.data));
      return this.onGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return (
      <PermittedDomains
        data={this.props.data}
        onSubmit={this.onSubmit}
        onGoToPreviousStep={this.onGoToPreviousStep}
      />
    );
  }
}

export default withInstallMutation(CreateYourAccountContainer);
