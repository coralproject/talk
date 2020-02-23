import React from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { SiteSelectorContainer_query as QueryData } from "coral-admin/__generated__/SiteSelectorContainer_query.graphql";
import { SiteSelectorContainerPaginationQueryVariables } from "coral-admin/__generated__/SiteSelectorContainerPaginationQuery.graphql";

import SiteSelector from "./SiteSelector";

interface Props {
  query: QueryData | null;
  relay: RelayPaginationProp;
  queueName: string;
  siteID: string | null;
}

const SiteSelectorContainer: React.FunctionComponent<Props> = props => {
  const sites = props.query
    ? props.query.sites.edges.map(edge => edge.node)
    : [];
  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  const [, isRefetching] = useRefetch<
    SiteSelectorContainerPaginationQueryVariables
  >(props.relay);
  return (
    <SiteSelector
      loading={!props.query || isRefetching}
      sites={sites}
      onLoadMore={loadMore}
      hasMore={!isRefetching && props.relay.hasMore()}
      disableLoadMore={isLoadingMore}
      queueName={props.queueName}
      siteID={props.siteID}
    />
  );
};

type FragmentVariables = SiteSelectorContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  SiteSelectorContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment SiteSelectorContainer_query on Query
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 10 }
          cursor: { type: "Cursor" }
        ) {
        sites(first: $count, after: $cursor)
          @connection(key: "SitesConfig_sites") {
          edges {
            node {
              id
              ...SiteSelectorSite_site
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
      query SiteSelectorContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
      ) {
        ...SiteSelectorContainer_query
          @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)(SiteSelectorContainer);
export default enhanced;
