import { BadUserInputError } from "talk-framework/lib/errors";
import SignUp, { SignUpForm } from "../components/SignUp";

import React, { Component } from "react";
import { SignUpMutation, withSignUpMutation } from "../mutations";

interface SignUpContainerProps {
  signUp: SignUpMutation;
}

class SignUpContainer extends Component<SignUpContainerProps> {
  private onSubmit: SignUpForm["onSubmit"] = async (input, form) => {
    try {
      await this.props.signUp(input);
      form.reset();
    } catch (error) {
      if (error instanceof BadUserInputError) {
        return error.invalidArgsLocalized;
      }
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return undefined;
  };
  public render() {
    return <SignUp onSubmit={this.onSubmit} />;
  }
}

const enhanced = withSignUpMutation(SignUpContainer);
export default enhanced;
