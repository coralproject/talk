import { RouteProps } from "found";
import React from "react";

import { createRouteConfig } from "coral-framework/lib/router";

import Reports from "./Reports";

const ReportsRoute: React.FunctionComponent & {
  routeConfig: RouteProps;
} = () => {
  return <Reports />;
};

ReportsRoute.routeConfig = createRouteConfig({ Component: ReportsRoute });

export default ReportsRoute;
