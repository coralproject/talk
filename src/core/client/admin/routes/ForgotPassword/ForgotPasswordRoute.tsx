import { withRouteConfig } from "coral-framework/lib/router";
import React from "react";
import ForgotPasswordContainer from "./ForgotPasswordContainer";

const ForgotPasswordRoute: React.FunctionComponent = () => {
  return <ForgotPasswordContainer />;
};

const enhanced = withRouteConfig({})(ForgotPasswordRoute);

export default enhanced;
