import React from "react";
import { graphql } from "react-relay";

import MainLayout from "coral-admin/components/MainLayout";
import { withRouteConfig } from "coral-framework/lib/router";

import { DashboardRouteQueryResponse } from "coral-admin/__generated__/DashboardRouteQuery.graphql";

import DashboardSiteSelectorContainer from "./DashboardSiteSelectorContainer";

interface Props {
  data: DashboardRouteQueryResponse | null;
}
const DashboardRoute: React.FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <MainLayout data-testid="dashboard-container">
      <DashboardSiteSelectorContainer query={data} />
    </MainLayout>
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query DashboardRouteQuery {
      ...DashboardSiteSelectorContainer_query
    }
  `,
})(DashboardRoute);

export default enhanced;
