import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import { FormData } from "../../containers/AppContainer";

import AddOrganization, {
  AddOrganizationForm,
} from "../components/AddOrganization";

interface AddOrganizationContainerProps {
  onGoToNextStep?: () => void;
  onGoToPreviousStep?: () => void;
  data: FormData;
  onSaveData: (newData: {}) => void;
}

class CreateYourAccountContainer extends Component<
  AddOrganizationContainerProps
> {
  private handleonGoToNextStep = () => {
    if (this.props.onGoToNextStep) {
      this.props.onGoToNextStep();
    }
  };
  private handleonGoToPreviousStep = () => {
    if (this.props.onGoToPreviousStep) {
      this.props.onGoToPreviousStep();
    }
  };
  private onSubmit: AddOrganizationForm["onSubmit"] = async (input, form) => {
    try {
      this.props.onSaveData(input);
      return this.handleonGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return (
      <AddOrganization
        data={this.props.data}
        onSubmit={this.onSubmit}
        handleonGoToPreviousStep={this.handleonGoToPreviousStep}
      />
    );
  }
}

export default CreateYourAccountContainer;
