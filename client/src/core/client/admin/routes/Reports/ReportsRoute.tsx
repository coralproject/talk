import { RouteProps } from "found";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { createRouteConfig } from "coral-framework/lib/router";

import { ReportsRouteQueryResponse } from "coral-admin/__generated__/ReportsRouteQuery.graphql";

import ReportsTableContainer from "./ReportsTableContainer";

interface Props {
  data: ReportsRouteQueryResponse | null;
}

const ReportsRoute: FunctionComponent<Props> & {
  routeConfig: RouteProps;
} = (props) => {
  return <ReportsTableContainer query={props.data} />;
};

ReportsRoute.routeConfig = createRouteConfig({
  query: graphql`
    query ReportsRouteQuery {
      ...ReportsTableContainer_query
    }
  `,
  cacheConfig: { force: true },
  Component: ReportsRoute,
});

export default ReportsRoute;
