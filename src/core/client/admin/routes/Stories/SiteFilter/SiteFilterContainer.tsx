import React from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { SiteFilterContainer_query as QueryData } from "coral-admin/__generated__/SiteFilterContainer_query.graphql";
import { SiteFilterContainerPaginationQueryVariables } from "coral-admin/__generated__/SiteFilterContainerPaginationQuery.graphql";

import SiteFilter from "./SiteFilter";

interface Props {
  query: QueryData | null;
  relay: RelayPaginationProp;
  siteID: string | null;
  onSelect: (id: string) => void;
}

const SiteFilterContainer: React.FunctionComponent<Props> = (props) => {
  const sites = props.query
    ? props.query.sites.edges.map((edge) => edge.node)
    : [];
  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  return (
    <SiteFilter
      onSelect={props.onSelect}
      loading={!props.query}
      sites={sites}
      siteID={props.siteID}
      onLoadMore={loadMore}
      hasMore={props.relay.hasMore()}
      disableLoadMore={isLoadingMore}
      relay={props.relay}
    />
  );
};

type FragmentVariables = SiteFilterContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  SiteFilterContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment SiteFilterContainer_query on Query
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "Cursor" }
          searchFilter: { type: "String" }
        ) {
        sites(first: $count, after: $cursor, query: $searchFilter)
          @connection(key: "SitesConfig_sites") {
          edges {
            node {
              id
              ...SiteFilterOption_site
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.query && props.query.sites;
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        searchFilter: fragmentVariables.searchFilter,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query SiteFilterContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $searchFilter: String
      ) {
        ...SiteFilterContainer_query
          @arguments(
            count: $count
            cursor: $cursor
            searchFilter: $searchFilter
          )
      }
    `,
  }
)(SiteFilterContainer);
export default enhanced;
