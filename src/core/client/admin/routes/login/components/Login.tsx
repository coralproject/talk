import React, { FunctionComponent } from "react";

import { PropTypesOf } from "talk-framework/types";

import AddEmailAddressContainer from "../views/addEmailAddress/containers/AddEmailAddressContainer";
import CreatePasswordContainer from "../views/createPassword/containers/CreatePasswordContainer";
import CreateUsernameContainer from "../views/createUsername/containers/CreateUsernameContainer";
import SignInContainer from "../views/signIn/containers/SignInContainer";

export type View =
  | "SIGN_UP"
  | "SIGN_IN"
  | "FORGOT_PASSWORD"
  | "CREATE_USERNAME"
  | "CREATE_PASSWORD"
  | "ADD_EMAIL_ADDRESS"
  | "%future added value";

export interface AppProps {
  view: View;
  auth: PropTypesOf<typeof SignInContainer>["auth"];
}

const renderView = (view: AppProps["view"], auth: AppProps["auth"]) => {
  switch (view) {
    case "SIGN_IN":
      return <SignInContainer auth={auth} />;
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

const App: FunctionComponent<AppProps> = ({ view, auth }) => (
  <div>{renderView(view, auth)}</div>
);

export default App;
