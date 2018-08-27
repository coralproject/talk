import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import SignUp, { SignUpForm } from "../components/SignUp";

import {
  SetViewMutation,
  SignUpMutation,
  withSetViewMutation,
  withSignUpMutation,
} from "../mutations";

interface SignUpContainerProps {
  signUp: SignUpMutation;
  setView: SetViewMutation;
}

class SignUpContainer extends Component<SignUpContainerProps> {
  private onSubmit: SignUpForm["onSubmit"] = async (input, form) => {
    try {
      return await this.props.signUp(input);
      form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  private goToSignIn = () => this.props.setView({ view: "SIGN_IN" });
  public render() {
    return <SignUp onSubmit={this.onSubmit} onGotoSignIn={this.goToSignIn} />;
  }
}

const enhanced = withSetViewMutation(withSignUpMutation(SignUpContainer));
export default enhanced;
