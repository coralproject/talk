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
  errorMessage: string;
}

export type View = "SIGN_UP" | "FORGOT_PASSWORD";

class SignInContainer extends Component<
  SignInContainerProps,
  SignUpContainerState
> {
  public state = { errorMessage: "" };
  private setView = (view: View) => {
    this.props.setView({
      view,
    });
  };
  private onSubmit: SignInForm["onSubmit"] = async (input, form) => {
    try {
      const res = await this.props.signIn(input);
      console.log(res);
      // form.reset();
    } catch (error) {
      if (error instanceof BadUserInputError) {
        return error.invalidArgsLocalized;
      }
      console.log(error);
      this.setState({ errorMessage: `Error: ${error}` });
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return undefined;
  };
  public render() {
    return (
      <SignIn
        onSubmit={this.onSubmit}
        setView={this.setView}
        errorMessage={this.state.errorMessage}
      />
    );
  }
}

const enhanced = withSetViewMutation(withSignInMutation(SignInContainer));
export default enhanced;
