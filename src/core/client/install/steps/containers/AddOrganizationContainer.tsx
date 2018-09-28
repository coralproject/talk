import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import AddOrganization, {
  AddOrganizationForm,
} from "../components/AddOrganization";

import {
  UpdateSettingsMutation,
  withUpdateSettingsMutation,
} from "../mutations";

interface AddOrganizationContainerProps {
  updateSettings: UpdateSettingsMutation;
  goToNextStep?: () => void;
}

class CreateYourAccountContainer extends Component<
  AddOrganizationContainerProps
> {
  private handleGoToNextStep = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  };
  private onSubmit: AddOrganizationForm["onSubmit"] = async (input, form) => {
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
    return <AddOrganization onSubmit={this.onSubmit} />;
  }
}

export default withUpdateSettingsMutation(CreateYourAccountContainer);
