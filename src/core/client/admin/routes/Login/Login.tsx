import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";

import AddEmailAddress from "./views/AddEmailAddress";
import CreatePasswordContainer from "./views/CreatePassword";
import CreateUsernameContainer from "./views/CreateUsername";
import LinkAccountContainer from "./views/LinkAccount";
import SignInContainer from "./views/SignIn";

export type View =
  | "SIGN_UP"
  | "SIGN_IN"
  | "FORGOT_PASSWORD"
  | "CREATE_USERNAME"
  | "CREATE_PASSWORD"
  | "ADD_EMAIL_ADDRESS"
  | "LINK_ACCOUNT"
  | "%future added value";

interface Props {
  view: View;
  auth: PropTypesOf<typeof SignInContainer>["auth"];
  viewer: PropTypesOf<typeof LinkAccountContainer>["viewer"];
}

const renderView = (
  view: Props["view"],
  auth: Props["auth"],
  viewer: Props["viewer"]
) => {
  switch (view) {
    case "SIGN_IN":
      return <SignInContainer auth={auth} />;
    case "CREATE_USERNAME":
      return <CreateUsernameContainer />;
    case "CREATE_PASSWORD":
      return <CreatePasswordContainer />;
    case "ADD_EMAIL_ADDRESS":
      return <AddEmailAddress />;
    case "LINK_ACCOUNT":
      return <LinkAccountContainer viewer={viewer} />;
    default:
      throw new Error(`Unknown view ${view}`);
  }
};

const Login: FunctionComponent<Props> = ({ view, auth, viewer }) => (
  <div>{renderView(view, auth, viewer)}</div>
);

export default Login;
