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

interface SignUpContainerState {
  error: string | null;
}

export type View = "SIGN_UP" | "FORGOT_PASSWORD";

class SignInContainer extends Component<
  SignInContainerProps,
  SignUpContainerState
> {
  private setView = (view: View) => {
    this.props.setView({
      view,
    });
  };
  private onSubmit: SignInForm["onSubmit"] = async (input, form) => {
    try {
      await this.props.signIn(input);
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  private goToForgotPassword = () => this.setView("FORGOT_PASSWORD");
  private goToSignUp = () => this.setView("SIGN_UP");
  public render() {
    return (
      <SignIn
        onSubmit={this.onSubmit}
        goToForgotPassword={this.goToForgotPassword}
        goToSignUp={this.goToSignUp}
      />
    );
  }
}

const enhanced = withSetViewMutation(withSignInMutation(SignInContainer));
export default enhanced;
