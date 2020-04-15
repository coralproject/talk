import React from "react";

import { withRouteConfig } from "coral-framework/lib/router";

import Dashboard from "./Dashboard";

const DashboardRoute: React.FunctionComponent = () => {
  return <Dashboard />;
};

const enhanced = withRouteConfig({})(DashboardRoute);

export default enhanced;
