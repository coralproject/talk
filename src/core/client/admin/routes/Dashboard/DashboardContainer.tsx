import React from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import MainLayout from "coral-admin/components/MainLayout";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { DashboardContainer_query as QueryData } from "coral-admin/__generated__/DashboardContainer_query.graphql";
import { DashboardContainerPaginationQueryVariables } from "coral-admin/__generated__/DashboardContainerPaginationQuery.graphql";

import SiteDashboardHeader from "./components/SiteDashboardHeader";
import Dashboard from "./Dashboard";
import DashboardSiteSelector from "./DashboardSiteSelector";

interface Props {
  query: QueryData | null;
  relay: RelayPaginationProp;
  selectedSiteID?: string;
}
const DashboardContainer: React.FunctionComponent<Props> = (props) => {
  const sites = props.query
    ? props.query.sites.edges.map((edge) => edge.node)
    : [];
  const selectedSite = props.selectedSiteID
    ? sites.find((s) => s.id === props.selectedSiteID)
    : sites[0];
  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  const [, isRefetching] = useRefetch<
    DashboardContainerPaginationQueryVariables
  >(props.relay);
  return (
    <MainLayout>
      <IntersectionProvider>
        <DashboardSiteSelector
          loading={!props.query || isRefetching}
          sites={sites}
          onLoadMore={loadMore}
          hasMore={!isRefetching && props.relay.hasMore()}
          disableLoadMore={isLoadingMore}
        />
      </IntersectionProvider>
      {selectedSite && (
        <>
          <SiteDashboardHeader name={selectedSite.name} />
          <Dashboard siteID={selectedSite.id} />
        </>
      )}
    </MainLayout>
  );
};

type FragmentVariables = DashboardContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  DashboardContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment DashboardContainer_query on Query
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 20 }
          cursor: { type: "Cursor" }
        ) {
        sites(first: $count, after: $cursor)
          @connection(key: "SitesConfig_sites") {
          edges {
            node {
              id
              name
              ...DashboardSiteRowContainer_site
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.query && props.query.sites;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query DashboardContainerPaginationQuery($count: Int!, $cursor: Cursor) {
        ...DashboardContainer_query @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)(DashboardContainer);
export default enhanced;
