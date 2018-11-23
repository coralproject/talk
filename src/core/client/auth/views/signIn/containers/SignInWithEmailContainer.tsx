import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import {
  SetViewMutation,
  SignInMutation,
  withSetViewMutation,
  withSignInMutation,
} from "talk-auth/mutations";

import SignInWithEmail, {
  SignInWithEmailForm,
} from "../components/SignInWithEmail";

interface SignInContainerProps {
  signIn: SignInMutation;
  setView: SetViewMutation;
}

class SignInContainer extends Component<SignInContainerProps> {
  private onSubmit: SignInWithEmailForm["onSubmit"] = async (input, form) => {
    try {
      await this.props.signIn(input);
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  private goToForgotPassword = () =>
    this.props.setView({ view: "FORGOT_PASSWORD" });
  public render() {
    return (
      <SignInWithEmail
        onSubmit={this.onSubmit}
        onGotoForgotPassword={this.goToForgotPassword}
      />
    );
  }
}

const enhanced = withSetViewMutation(withSignInMutation(SignInContainer));
export default enhanced;
