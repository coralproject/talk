import { Match, Router } from "found";
import React from "react";
import { graphql } from "react-relay";

import MainLayout from "coral-admin/components/MainLayout";
import { withRouteConfig } from "coral-framework/lib/router";

import { SiteDashboardRouteQueryResponse } from "coral-admin/__generated__/SiteDashboardRouteQuery.graphql";

import { SiteDashboardHeader } from "./components";
import DashboardContainer from "./DashboardContainer";

import styles from "./SiteDashboard.css";

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
    return (
      <MainLayout data-testid="dashboard-container" className={styles.layout}>
        <SiteDashboardHeader name={data.site.name} />
        <DashboardContainer siteID={props.match.params.siteID} />
      </MainLayout>
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
    }
  `,
})(SiteDashboardRoute);

export default enhanced;
