import React, { useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { SitesConfigContainer_query as QueryData } from "coral-admin/__generated__/SitesConfigContainer_query.graphql";
import { SitesConfigContainerPaginationQueryVariables } from "coral-admin/__generated__/SitesConfigContainerPaginationQuery.graphql";

import SitesConfig from "./SitesConfig";

interface Props {
  query: QueryData | null;
  relay: RelayPaginationProp;
}
const SitesConfigContainer: React.FunctionComponent<Props> = (props) => {
  const sites = useMemo(
    () => (props.query ? props.query.sites.edges.map((edge) => edge.node) : []),
    [props?.query?.sites.edges]
  );
  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 20);

  return (
    <IntersectionProvider>
      <SitesConfig
        loading={!props.query}
        sites={sites}
        onLoadMore={loadMore}
        hasMore={props.relay.hasMore()}
        disableLoadMore={isLoadingMore}
      />
    </IntersectionProvider>
  );
};

type FragmentVariables = SitesConfigContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  SitesConfigContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment SitesConfigContainer_query on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "Cursor" }
      ) {
        sites(first: $count, after: $cursor)
          @connection(key: "SitesConfig_sites") {
          edges {
            node {
              id
              ...SiteRowContainer_site
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
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query SitesConfigContainerPaginationQuery($count: Int!, $cursor: Cursor) {
        ...SitesConfigContainer_query @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)(SitesConfigContainer);

export default enhanced;
