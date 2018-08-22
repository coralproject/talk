import React, { Component } from "react";
import { BadUserInputError } from "talk-framework/lib/errors";

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
  public state = { error: null };
  private setView = (view: View) => {
    this.props.setView({
      view,
    });
  };
  private onSubmit: SignInForm["onSubmit"] = async (input, form) => {
    try {
      await this.props.signIn(input);
      form.reset();
    } catch (error) {
      this.setState({ error: error.message });
      if (error instanceof BadUserInputError) {
        return error.invalidArgsLocalized;
      }
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return undefined;
  };
  private goToForgotPassword = () => this.setView("FORGOT_PASSWORD");
  private goToSignUp = () => this.setView("SIGN_UP");
  public render() {
    return (
      <SignIn
        onSubmit={this.onSubmit}
        goToForgotPassword={this.goToForgotPassword}
        goToSignUp={this.goToSignUp}
        error={this.state.error}
      />
    );
  }
}

const enhanced = withSetViewMutation(withSignInMutation(SignInContainer));
export default enhanced;
