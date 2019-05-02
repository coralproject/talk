import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import {
  SetViewMutation,
  SignInMutation,
  withSignInMutation,
} from "talk-auth/mutations";
import { MutationProp, withMutation } from "talk-framework/lib/relay";

import SignInWithEmail, {
  SignInWithEmailForm,
} from "../components/SignInWithEmail";

interface SignInContainerProps {
  signIn: SignInMutation;
  setView: MutationProp<typeof SetViewMutation>;
}

class SignInContainer extends Component<SignInContainerProps> {
  private onSubmit: SignInWithEmailForm["onSubmit"] = async (input, form) => {
    try {
      await this.props.signIn({ email: input.email, password: input.password });
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  private goToForgotPassword = () =>
    this.props.setView({ view: "FORGOT_PASSWORD", history: "push" });
  public render() {
    return (
      <SignInWithEmail
        onSubmit={this.onSubmit}
        onGotoForgotPassword={this.goToForgotPassword}
      />
    );
  }
}

const enhanced = withMutation(SetViewMutation)(
  withSignInMutation(SignInContainer)
);
export default enhanced;
