import React, { useMemo } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";

import { DashboardRouteQueryResponse } from "coral-admin/__generated__/DashboardRouteQuery.graphql";

import DashboardContainer from "./DashboardContainer";

interface Props {
  data: DashboardRouteQueryResponse | null;
}
const DashboardRoute: React.FunctionComponent<Props> = ({ data }) => {
  const firstSite = useMemo(() => {
    if (data) {
      if (
        data.viewer?.moderationScopes?.scoped &&
        data.viewer.moderationScopes.sites &&
        data.viewer.moderationScopes.sites.length > 0
      ) {
        return data.viewer.moderationScopes.sites[0];
      }
      return data.firstSite.edges && data.firstSite.edges.length > 0
        ? data.firstSite.edges[0].node
        : null;
    }
    return null;
  }, [data]);

  if (!data) {
    return null;
  }

  return <DashboardContainer query={data} site={firstSite} />;
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
      viewer {
        moderationScopes {
          scoped
          sites {
            id
            name
            ...DashboardSiteContainer_site
          }
        }
      }
      ...DashboardContainer_query
    }
  `,
})(DashboardRoute);

export default enhanced;
