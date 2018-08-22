import React, { StatelessComponent } from "react";
import * as styles from "./App.css";

import ForgotPasswordContainer from "../containers/ForgotPasswordContainer";
import ResetPasswordContainer from "../containers/ResetPasswordContainer";
import SignInContainer from "../containers/SignInContainer";
import SignUpContainer from "../containers/SignUpContainer";

// TODO: (cvle) Remove %future added value when we have Relay 1.6
// https://github.com/facebook/relay/commit/1e87e43add7667a494f7ff4cfa7f03f1ab8d81a2
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
      return <SignInContainer />;
  }
};

const App: StatelessComponent<AppProps> = ({ view }) => (
  <div className={styles.root}>{renderView(view)}</div>
);

export default App;
