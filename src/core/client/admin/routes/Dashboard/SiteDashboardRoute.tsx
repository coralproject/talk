import { Match, Router } from "found";
import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";

import { SiteDashboardRouteQueryResponse } from "coral-admin/__generated__/SiteDashboardRouteQuery.graphql";

import DashboardContainer from "./DashboardContainer";

interface RouteParams {
  siteID: string;
}

interface Props {
  data: SiteDashboardRouteQueryResponse | null;
  router: Router;
  match: Match & { params: RouteParams };
}
const SiteDashboardRoute: React.FunctionComponent<Props> = (props) => {
  const { data } = props;
  if (data && data.site) {
    return <DashboardContainer query={data} site={data.site} />;
  }
  return null;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query SiteDashboardRouteQuery($siteID: ID!) {
      ...DashboardContainer_query
      site(id: $siteID) {
        name
        id
      }
    }
  `,
})(SiteDashboardRoute);

export default enhanced;
