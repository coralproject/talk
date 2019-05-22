import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { SignUpMutation, withSignUpMutation } from "coral-auth/mutations";
import { PropTypesOf } from "coral-framework/types";

import SignUp from "../components/SignUpWithEmail";

interface SignUpContainerProps {
  signUp: SignUpMutation;
}

class SignUpContainer extends Component<SignUpContainerProps> {
  private handleSubmit: PropTypesOf<typeof SignUp>["onSubmit"] = async (
    input,
    form
  ) => {
    try {
      await this.props.signUp({
        email: input.email,
        password: input.password,
        username: input.username,
      });
      return form.reset();
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
