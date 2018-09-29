import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import { FormData } from "../../containers/AppContainer";

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
  goToPreviousStep?: () => void;
  data: Partial<FormData>;
  saveData: (newData: {}) => void;
}

class CreateYourAccountContainer extends Component<
  AddOrganizationContainerProps
> {
  private handleGoToNextStep = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  };
  private handleGoToPreviousStep = () => {
    if (this.props.goToPreviousStep) {
      this.props.goToPreviousStep();
    }
  };
  private onSubmit: AddOrganizationForm["onSubmit"] = async (input, form) => {
    try {
      //  ERROR NOT AUTHORIZED
      // await this.props.updateSettings({ settings: { ...input } });
      // form.reset();
      this.props.saveData(input);
      return this.handleGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return (
      <AddOrganization
        data={this.props.data}
        onSubmit={this.onSubmit}
        handleGoToPreviousStep={this.handleGoToPreviousStep}
      />
    );
  }
}

export default withUpdateSettingsMutation(CreateYourAccountContainer);
