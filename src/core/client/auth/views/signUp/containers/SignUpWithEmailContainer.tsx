import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import SignUp, { SignUpForm } from "../components/SignUpWithEmail";

import { SignUpMutation, withSignUpMutation } from "talk-auth/mutations";

interface SignUpContainerProps {
  signUp: SignUpMutation;
}

class SignUpContainer extends Component<SignUpContainerProps> {
  private onSubmit: SignUpForm["onSubmit"] = async (input, form) => {
    try {
      await this.props.signUp(input);
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return <SignUp onSubmit={this.onSubmit} />;
  }
}

const enhanced = withSignUpMutation(SignUpContainer);
export default enhanced;
