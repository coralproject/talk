import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { SignUpMutation, withSignUpMutation } from "./SignUpMutation";
import SignUp from "./SignUpWithEmail";

interface SignUpContainerProps {
  signUp: SignUpMutation;
}

class SignUpContainer extends Component<SignUpContainerProps> {
  private handleSubmit = async (input: any) => {
    try {
      await this.props.signUp({
        email: input.email,
        password: input.password,
        username: input.username,
      });
      return;
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return <SignUp onSubmit={this.handleSubmit} />;
  }
}

const enhanced = withSignUpMutation(SignUpContainer);
export default enhanced;
