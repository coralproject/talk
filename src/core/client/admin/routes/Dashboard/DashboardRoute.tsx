import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";

import { DashboardRouteQueryResponse } from "coral-admin/__generated__/DashboardRouteQuery.graphql";

import DashboardContainer from "./DashboardContainer";
import DashboardSiteSelectorContainer from "./DashboardSiteSelectorContainer";

interface Props {
  data: DashboardRouteQueryResponse | null;
}
const DashboardRoute: React.FunctionComponent<Props> = ({ data }) => {
  if (data && data.settings) {
    if (!data.settings.multisite) {
      return <DashboardContainer settings={data.settings} />;
    }
    return <DashboardSiteSelectorContainer query={data} />;
  }
  return null;
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
