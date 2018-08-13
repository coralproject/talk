import { BadUserInputError } from "talk-framework/lib/errors";
import SignIn, { SignInForm } from "../components/SignIn";

import React, { Component } from "react";
import { SignInMutation, withSignInMutation } from "../mutations";

interface SignInContainerProps {
  signIn: SignInMutation;
}

class SignInContainer extends Component<SignInContainerProps> {
  private onSubmit: SignInForm["onSubmit"] = async (input, form) => {
    try {
      await this.props.signIn(input);
      form.reset();
    } catch (error) {
      if (error instanceof BadUserInputError) {
        return error.invalidArgsLocalized;
      }
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return undefined;
  };
  public render() {
    return <SignIn onSubmit={this.onSubmit} />;
  }
}

const enhanced = withSignInMutation(SignInContainer);
export default enhanced;
