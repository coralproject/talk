import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";

import { DashboardRouteQueryResponse } from "coral-admin/__generated__/DashboardRouteQuery.graphql";

import DashboardSiteSelectorContainer from "./DashboardContainer";

interface Props {
  data: DashboardRouteQueryResponse | null;
}
const DashboardRoute: React.FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return null;
  }

  return <DashboardSiteSelectorContainer query={data} />;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query DashboardRouteQuery {
      ...DashboardContainer_query
    }
  `,
})(DashboardRoute);

export default enhanced;
