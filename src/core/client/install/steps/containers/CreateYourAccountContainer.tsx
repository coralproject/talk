import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import CreateYourAccount, {
  CreateYourAccountForm,
} from "../components/CreateYourAccount";

import { SignUpMutation, withSignUpMutation } from "../mutations";

interface SignUpContainerProps {
  signUp: SignUpMutation;
  goToNextStep?: () => void;
}

class CreateYourAccountContainer extends Component<SignUpContainerProps> {
  private handleGoToNextStep = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  };
  private onSubmit: CreateYourAccountForm["onSubmit"] = async (input, form) => {
    try {
      await this.props.signUp(input);
      form.reset();
      return this.handleGoToNextStep();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return <CreateYourAccount onSubmit={this.onSubmit} />;
  }
}

export default withSignUpMutation(CreateYourAccountContainer);
