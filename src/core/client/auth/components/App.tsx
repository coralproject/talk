import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";

import SignUpContainer from "../containers/SignUpContainer";
import ForgotPasswordContainer from "../views/forgotPassword/containers/ForgotPasswordContainer";
import ResetPasswordContainer from "../views/resetPassword/containers/ResetPasswordContainer";
import SignInContainer from "../views/signIn/containers/SignInContainer";
import "./App.css";

export type View =
  | "SIGN_UP"
  | "SIGN_IN"
  | "FORGOT_PASSWORD"
  | "RESET_PASSWORD"
  | "%future added value";

export interface AppProps {
  view: View;
  auth: PropTypesOf<typeof SignInContainer>["auth"];
}

const renderView = (view: AppProps["view"], auth: AppProps["auth"]) => {
  switch (view) {
    case "SIGN_UP":
      return <SignUpContainer />;
    case "SIGN_IN":
      return <SignInContainer auth={auth} />;
    case "FORGOT_PASSWORD":
      return <ForgotPasswordContainer />;
    case "RESET_PASSWORD":
      return <ResetPasswordContainer />;
    default:
      throw new Error(`Unknown view ${view}`);
  }
};

const App: StatelessComponent<AppProps> = ({ view, auth }) => (
  <div>{renderView(view, auth)}</div>
);

export default App;
