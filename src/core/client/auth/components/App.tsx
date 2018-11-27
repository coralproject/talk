import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";

import AddEmailAddressContainer from "../views/addEmailAddress/containers/AddEmailAddressContainer";
import CreatePasswordContainer from "../views/createPassword/containers/CreatePasswordContainer";
import CreateUsernameContainer from "../views/createUsername/containers/CreateUsernameContainer";
import ForgotPasswordContainer from "../views/forgotPassword/containers/ForgotPasswordContainer";
import ResetPasswordContainer from "../views/resetPassword/containers/ResetPasswordContainer";
import SignInContainer from "../views/signIn/containers/SignInContainer";
import SignUpContainer from "../views/signUp/containers/SignUpContainer";
import "./App.css";

export type View =
  | "SIGN_UP"
  | "SIGN_IN"
  | "FORGOT_PASSWORD"
  | "RESET_PASSWORD"
  | "CREATE_USERNAME"
  | "CREATE_PASSWORD"
  | "ADD_EMAIL_ADDRESS"
  | "%future added value";

export interface AppProps {
  view: View;
  auth: PropTypesOf<typeof SignInContainer>["auth"] &
    PropTypesOf<typeof SignUpContainer>["auth"];
}

const renderView = (view: AppProps["view"], auth: AppProps["auth"]) => {
  switch (view) {
    case "SIGN_UP":
      return <SignUpContainer auth={auth} />;
    case "SIGN_IN":
      return <SignInContainer auth={auth} />;
    case "FORGOT_PASSWORD":
      return <ForgotPasswordContainer />;
    case "RESET_PASSWORD":
      return <ResetPasswordContainer />;
    case "CREATE_USERNAME":
      return <CreateUsernameContainer />;
    case "CREATE_PASSWORD":
      return <CreatePasswordContainer />;
    case "ADD_EMAIL_ADDRESS":
      return <AddEmailAddressContainer />;
    default:
      throw new Error(`Unknown view ${view}`);
  }
};

const App: StatelessComponent<AppProps> = ({ view, auth }) => (
  <div>{renderView(view, auth)}</div>
);

export default App;
