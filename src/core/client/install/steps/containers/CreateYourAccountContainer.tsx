import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { PropTypesOf } from "talk-ui/types";

import CreateYourAccount, {
  CreateYourAccountForm,
} from "../components/CreateYourAccount";

interface CreateYourAccountContainerProps {
  onGoToNextStep: () => void;
  onGoToPreviousStep: () => void;
  data: PropTypesOf<typeof CreateYourAccount>["data"];
  onSaveData: (newData: PropTypesOf<typeof CreateYourAccount>["data"]) => void;
}

class CreateYourAccountContainer extends Component<
  CreateYourAccountContainerProps
> {
  private onGoToPreviousStep = () => {
    if (this.props.onGoToPreviousStep) {
      this.props.onGoToPreviousStep();
    }
  };
  private onGoToNextStep = () => {
    if (this.props.onGoToNextStep) {
      this.props.onGoToNextStep();
    }
  };
  private onSubmit: CreateYourAccountForm["onSubmit"] = async (input, form) => {
    try {
      this.props.onSaveData(input);
      return this.onGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return (
      <CreateYourAccount
        data={this.props.data}
        onSubmit={this.onSubmit}
        onGoToPreviousStep={this.onGoToPreviousStep}
      />
    );
  }
}

export default CreateYourAccountContainer;
