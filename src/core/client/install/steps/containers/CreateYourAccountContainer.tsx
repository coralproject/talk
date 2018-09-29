import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import { FormData } from "../../containers/AppContainer";

import CreateYourAccount, {
  CreateYourAccountForm,
} from "../components/CreateYourAccount";

import { SignUpMutation, withSignUpMutation } from "../mutations";

interface SignUpContainerProps {
  signUp: SignUpMutation;
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  data: Partial<FormData>;
  saveData: (newData: {}) => void;
}

class CreateYourAccountContainer extends Component<SignUpContainerProps> {
  private handleGoToPreviousStep = () => {
    if (this.props.goToPreviousStep) {
      this.props.goToPreviousStep();
    }
  };
  private handleGoToNextStep = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  };
  private onSubmit: CreateYourAccountForm["onSubmit"] = async (input, form) => {
    try {
      // await this.props.signUp(input);
      // form.reset();
      this.props.saveData(input);
      return this.handleGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return (
      <CreateYourAccount
        data={this.props.data}
        onSubmit={this.onSubmit}
        handleGoToPreviousStep={this.handleGoToPreviousStep}
      />
    );
  }
}

export default withSignUpMutation(CreateYourAccountContainer);
