import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { PropTypesOf } from "talk-ui/types";

import AddOrganization, {
  AddOrganizationForm,
} from "../components/AddOrganization";

interface AddOrganizationContainerProps {
  onGoToNextStep: () => void;
  onGoToPreviousStep: () => void;
  data: PropTypesOf<typeof AddOrganization>["data"];
  onSaveData: (newData: PropTypesOf<typeof AddOrganization>["data"]) => void;
}

class AddOrganizationContainer extends Component<
  AddOrganizationContainerProps
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
  private onSubmit: AddOrganizationForm["onSubmit"] = async (input, form) => {
    try {
      this.props.onSaveData(input);
      return this.onGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return (
      <AddOrganization
        data={this.props.data}
        onSubmit={this.onSubmit}
        onGoToPreviousStep={this.onGoToPreviousStep}
      />
    );
  }
}

export default AddOrganizationContainer;
