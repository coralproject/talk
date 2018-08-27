import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import SignIn, { SignInForm } from "../components/SignIn";
import {
  SetViewMutation,
  SignInMutation,
  withSetViewMutation,
  withSignInMutation,
} from "../mutations";

interface SignInContainerProps {
  signIn: SignInMutation;
  setView: SetViewMutation;
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
  private goToForgotPassword = () =>
    this.props.setView({ view: "FORGOT_PASSWORD" });
  private goToSignUp = () => this.props.setView({ view: "SIGN_UP" });
  public render() {
    return (
      <SignIn
        onSubmit={this.onSubmit}
        onGotoForgotPassword={this.goToForgotPassword}
        onGotoSignUp={this.goToSignUp}
      />
    );
  }
}

const enhanced = withSetViewMutation(withSignInMutation(SignInContainer));
export default enhanced;
