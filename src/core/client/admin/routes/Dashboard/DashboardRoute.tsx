import React from "react";
import { graphql } from "react-relay";

import MainLayout from "coral-admin/components/MainLayout";
import { withRouteConfig } from "coral-framework/lib/router";

import { DashboardRouteQueryResponse } from "coral-admin/__generated__/DashboardRouteQuery.graphql";

import DashboardContainer from "./DashboardContainer";
import DashboardSiteSelectorContainer from "./DashboardSiteSelectorContainer";

interface Props {
  data: DashboardRouteQueryResponse | null;
}
const DashboardRoute: React.FunctionComponent<Props> = ({ data }) => {
  if (!data || !data.settings) {
    return null;
  }
  return (
    <MainLayout data-testid="dashboard-container">
      {data.settings.multisite ? (
        <DashboardSiteSelectorContainer query={data} />
      ) : (
        <DashboardContainer settings={data.settings} />
      )}
    </MainLayout>
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query DashboardRouteQuery {
      settings {
        multisite
        ...DashboardContainer_settings
      }
      ...DashboardSiteSelectorContainer_query
    }
  `,
})(DashboardRoute);

export default enhanced;
