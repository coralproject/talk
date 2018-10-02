import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import { FormData } from "../../containers/AppContainer";

import PermittedDomains, {
  PermittedDomainsForm,
} from "../components/PermittedDomains";

import { InstallMutation, withInstallMutation } from "../mutations";

interface PermittedDomainsContainerProps {
  install: InstallMutation;
  goToNextStep?: () => void;
  data: Partial<FormData>;
  saveData: (newData: {}) => void;
}

class CreateYourAccountContainer extends Component<
  PermittedDomainsContainerProps
> {
  private handleGoToNextStep = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  };
  private onSubmit: PermittedDomainsForm["onSubmit"] = async (input, form) => {
    try {
      //  ERROR NOT AUTHORIZED
      // await this.props.updateSettings({ settings: { ...input } });
      // form.reset();
      return this.handleGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return <PermittedDomains onSubmit={this.onSubmit} />;
  }
}

export default withInstallMutation(CreateYourAccountContainer);
