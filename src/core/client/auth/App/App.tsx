import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";

import AddEmailAddress from "../views/AddEmailAddress";
import CreatePassword from "../views/CreatePassword";
import CreateUsername from "../views/CreateUsername";
import ForgotPassword from "../views/ForgotPassword";
import LinkAccount from "../views/LinkAccount";
import SignInContainer from "../views/SignIn";
import SignUpContainer from "../views/SignUp";
import ViewRouter from "./ViewRouter";

import "./App.css";

export type View =
  | "SIGN_UP"
  | "SIGN_IN"
  | "FORGOT_PASSWORD"
  | "CREATE_USERNAME"
  | "CREATE_PASSWORD"
  | "ADD_EMAIL_ADDRESS"
  | "DUPLICATE_EMAIL"
  | "%future added value";

export interface AppProps {
  view: View;
  viewer: PropTypesOf<typeof ForgotPassword>["viewer"];
  auth: PropTypesOf<typeof SignInContainer>["auth"] &
    PropTypesOf<typeof SignUpContainer>["auth"];
}

const render = ({ view, auth, viewer }: AppProps) => {
  switch (view) {
    case "SIGN_UP":
      return <SignUpContainer auth={auth} />;
    case "SIGN_IN":
      return <SignInContainer auth={auth} />;
    case "FORGOT_PASSWORD":
      return <ForgotPassword viewer={viewer} />;
    case "CREATE_USERNAME":
      return <CreateUsername />;
    case "CREATE_PASSWORD":
      return <CreatePassword />;
    case "ADD_EMAIL_ADDRESS":
      return <AddEmailAddress />;
    case "DUPLICATE_EMAIL":
      return <LinkAccount />;
    default:
      throw new Error(`Unknown view ${view}`);
  }
};

const App: FunctionComponent<AppProps> = props => {
  return (
    <div>
      {process.env.NODE_ENV !== "test" && <ViewRouter />}
      <div>{render(props)}</div>
    </div>
  );
};

export default App;
