import React from "react";

import { withRouteConfig } from "coral-framework/lib/router";

import ForgotPasswordContainer from "./ForgotPasswordContainer";

const ForgotPasswordRoute: React.FunctionComponent = () => {
  return <ForgotPasswordContainer />;
};

const enhanced = withRouteConfig({})(ForgotPasswordRoute);

export default enhanced;
