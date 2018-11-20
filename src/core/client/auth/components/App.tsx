import React, { StatelessComponent } from "react";
import styles from "./App.css";

import ForgotPasswordContainer from "../containers/ForgotPasswordContainer";
import ResetPasswordContainer from "../containers/ResetPasswordContainer";
import SignInContainer from "../containers/SignInContainer";
import SignUpContainer from "../containers/SignUpContainer";

export type View =
  | "SIGN_UP"
  | "SIGN_IN"
  | "FORGOT_PASSWORD"
  | "RESET_PASSWORD"
  | "%future added value";

export interface AppProps {
  view: View;
}

const renderView = (view: View) => {
  switch (view) {
    case "SIGN_UP":
      return <SignUpContainer />;
    case "SIGN_IN":
      return <SignInContainer />;
    case "FORGOT_PASSWORD":
      return <ForgotPasswordContainer />;
    case "RESET_PASSWORD":
      return <ResetPasswordContainer />;
    default:
      throw new Error(`Unknown view ${view}`);
  }
};

const App: StatelessComponent<AppProps> = ({ view }) => (
  <div className={styles.root}>{renderView(view)}</div>
);

export default App;
