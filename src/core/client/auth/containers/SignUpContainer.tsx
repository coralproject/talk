import React, { Component } from "react";
import { BadUserInputError } from "talk-framework/lib/errors";
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
  errorMessage: string;
}

export type View = "SIGN_IN";

class SignUpContainer extends Component<
  SignUpContainerProps,
  SignUpContainerState
> {
  public state = { errorMessage: "" };
  private setView = (view: View) => {
    this.props.setView({
      view,
    });
  };
  private onSubmit: SignUpForm["onSubmit"] = async (input, form) => {
    try {
      const res = await this.props.signUp(input);
      console.log("response", res);
      form.reset();
    } catch (error) {
      console.log("error", error);
      if (error instanceof BadUserInputError) {
        return error.invalidArgsLocalized;
      }
      this.setState({ errorMessage: `Something ${error}` });
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return undefined;
  };
  public render() {
    return (
      <SignUp
        onSubmit={this.onSubmit}
        setView={this.setView}
        errorMessage={this.state.errorMessage}
      />
    );
  }
}

const enhanced = withSetViewMutation(withSignUpMutation(SignUpContainer));
export default enhanced;
