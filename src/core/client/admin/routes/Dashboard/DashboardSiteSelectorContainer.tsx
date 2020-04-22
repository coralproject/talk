import React from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { DashboardSiteSelectorContainer_query as QueryData } from "coral-admin/__generated__/DashboardSiteSelectorContainer_query.graphql";
import { DashboardSiteSelectorContainerPaginationQueryVariables } from "coral-admin/__generated__/DashboardSiteSelectorContainerPaginationQuery.graphql";

import DashboardSiteSelector from "./DashboardSiteSelector";

interface Props {
  query: QueryData | null;
  relay: RelayPaginationProp;
}
const DashboardSiteSelectorContainer: React.FunctionComponent<
  Props
> = props => {
  const sites = props.query
    ? props.query.sites.edges.map(edge => edge.node)
    : [];
  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  const [, isRefetching] = useRefetch<
    DashboardSiteSelectorContainerPaginationQueryVariables
  >(props.relay);
  return (
    <IntersectionProvider>
      <DashboardSiteSelector
        loading={!props.query || isRefetching}
        sites={sites}
        onLoadMore={loadMore}
        hasMore={!isRefetching && props.relay.hasMore()}
        disableLoadMore={isLoadingMore}
      />
    </IntersectionProvider>
  );
};

type FragmentVariables = DashboardSiteSelectorContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  DashboardSiteSelectorContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment DashboardSiteSelectorContainer_query on Query
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 20 }
          cursor: { type: "Cursor" }
        ) {
        sites(first: $count, after: $cursor)
          @connection(key: "SitesConfig_sites") {
          edges {
            node {
              id
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
      query DashboardSiteSelectorContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
      ) {
        ...DashboardSiteSelectorContainer_query
          @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)(DashboardSiteSelectorContainer);
export default enhanced;
