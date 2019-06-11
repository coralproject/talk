import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";

import AddEmailAddressContainer from "./views/AddEmailAddress";
import CreatePasswordContainer from "./views/CreatePassword";
import CreateUsernameContainer from "./views/CreateUsername";
import SignInContainer from "./views/SignIn";

export type View =
  | "SIGN_UP"
  | "SIGN_IN"
  | "FORGOT_PASSWORD"
  | "CREATE_USERNAME"
  | "CREATE_PASSWORD"
  | "ADD_EMAIL_ADDRESS"
  | "%future added value";

interface Props {
  view: View;
  auth: PropTypesOf<typeof SignInContainer>["auth"];
}

const renderView = (view: Props["view"], auth: Props["auth"]) => {
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

const Login: FunctionComponent<Props> = ({ view, auth }) => (
  <div>{renderView(view, auth)}</div>
);

export default Login;
