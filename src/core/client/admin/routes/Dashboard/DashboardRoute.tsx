import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";

import { DashboardRouteQueryResponse } from "coral-admin/__generated__/DashboardRouteQuery.graphql";

import DashboardContainer from "./DashboardContainer";

interface Props {
  data: DashboardRouteQueryResponse | null;
}
const DashboardRoute: React.FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <DashboardContainer
      query={data}
      site={
        data.firstSite.edges && data.firstSite.edges.length > 0
          ? data.firstSite.edges[0].node
          : null
      }
    />
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query DashboardRouteQuery {
      firstSite: sites(first: 1) {
        edges {
          node {
            id
            name
          }
        }
      }
      ...DashboardContainer_query
    }
  `,
})(DashboardRoute);

export default enhanced;
