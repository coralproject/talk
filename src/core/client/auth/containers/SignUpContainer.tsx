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

interface SignUpContainerState {
  error: string | null;
}

export type View = "SIGN_IN";

class SignUpContainer extends Component<
  SignUpContainerProps,
  SignUpContainerState
> {
  private setView = (view: View) => {
    this.props.setView({
      view,
    });
  };
  private onSubmit: SignUpForm["onSubmit"] = async (input, form) => {
    try {
      return await this.props.signUp(input);
      form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  private goToSignIn = () => this.setView("SIGN_IN");
  public render() {
    return <SignUp onSubmit={this.onSubmit} goToSignIn={this.goToSignIn} />;
  }
}

const enhanced = withSetViewMutation(withSignUpMutation(SignUpContainer));
export default enhanced;
