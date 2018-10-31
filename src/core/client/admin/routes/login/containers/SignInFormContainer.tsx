import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import { SignInMutation, withSignInMutation } from "talk-admin/mutations";
import { PropTypesOf } from "talk-framework/types";

import SignInForm from "../components/SignInForm";

interface SignInContainerProps {
  signIn: SignInMutation;
}

class SignInContainer extends Component<SignInContainerProps> {
  private onSubmit: PropTypesOf<typeof SignInForm>["onSubmit"] = async (
    input,
    form
  ) => {
    try {
      await this.props.signIn(input);
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };
  public render() {
    return <SignInForm onSubmit={this.onSubmit} />;
  }
}

const enhanced = withSignInMutation(SignInContainer);
export default enhanced;
