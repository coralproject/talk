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
const SiteDashboardRoute: React.FunctionComponent<Props> = props => {
  const { data } = props;
  if (data && data.site && data.settings) {
    return (
      <>
        <h2>{data.site.name}</h2>
        <DashboardContainer
          siteID={props.match.params.siteID}
          settings={data.settings}
        />
        ;
      </>
    );
  }
  return null;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query SiteDashboardRouteQuery($siteID: ID!) {
      site(id: $siteID) {
        name
        id
      }
      settings {
        ...DashboardContainer_settings
      }
    }
  `,
})(SiteDashboardRoute);

export default enhanced;
