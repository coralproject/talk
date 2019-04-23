import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { SignInMutation } from "talk-admin/mutations";
import { MutationProp, withMutation } from "talk-framework/lib/relay";

import SignInWithEmail, {
  SignInWithEmailForm,
} from "../components/SignInWithEmail";

interface SignInContainerProps {
  signIn: MutationProp<typeof SignInMutation>;
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
  public render() {
    return <SignInWithEmail onSubmit={this.onSubmit} />;
  }
}

const enhanced = withMutation(SignInMutation)(SignInContainer);
export default enhanced;
