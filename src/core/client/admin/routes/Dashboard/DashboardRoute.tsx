import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";

import { DashboardRouteQueryResponse } from "coral-admin/__generated__/DashboardRouteQuery.graphql";

import DashboardContainer from "./DashboardContainer";

interface Props {
  data: DashboardRouteQueryResponse | null;
}
const DashboardRoute: React.FunctionComponent<Props> = ({ data }) => {
  if (data && data.settings) {
    return <DashboardContainer settings={data.settings} />;
  }
  return null;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query DashboardRouteQuery {
      settings {
        ...DashboardContainer_settings
      }
    }
  `,
})(DashboardRoute);

export default enhanced;
