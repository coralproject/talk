import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { MutationProp, withMutation } from "coral-framework/lib/relay";

import SignInMutation from "./SignInMutation";
import SignInWithEmail, { SignInWithEmailForm } from "./SignInWithEmail";

interface SignInContainerProps {
  signIn: MutationProp<typeof SignInMutation>;
}

class SignInContainer extends Component<SignInContainerProps> {
  private onSubmit: SignInWithEmailForm["onSubmit"] = async (input, form) => {
    try {
      await this.props.signIn({ email: input.email, password: input.password });
      return;
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return <SignInWithEmail onSubmit={this.onSubmit} />;
  }
}

const enhanced = withMutation(SignInMutation)(SignInContainer);
export default enhanced;
