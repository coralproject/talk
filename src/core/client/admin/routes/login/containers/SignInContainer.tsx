import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import { SignInMutation, withSignInMutation } from "talk-admin/mutations";

import SignIn, { SignInForm } from "../components/SignIn";

interface SignInContainerProps {
  signIn: SignInMutation;
}

class SignInContainer extends Component<SignInContainerProps> {
  private onSubmit: SignInForm["onSubmit"] = async (input, form) => {
    try {
      await this.props.signIn(input);
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return <SignIn onSubmit={this.onSubmit} />;
  }
}

const enhanced = withSignInMutation(SignInContainer);
export default enhanced;
